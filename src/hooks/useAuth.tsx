import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import db, { auth } from "@/firebase/initFirebase";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Buscar usuário no Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        toast.error("Usuário não encontrado no banco de dados.");
        return;
      }

      const userData = userDoc.data();

      // Redirecionamento baseado no tipo
      if (userData.tipo === "admin") {
        router.push("/admin");
      } else if (userData.tipo === "responsavel") {
        router.push("/responsavel");
      } else if (userData.tipo === "pesquisador") {
        router.push("/pesquisador");
      } else {
        toast.error("Tipo de usuário desconhecido.");
      }

      toast.success("Login bem-sucedido!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading };
};
