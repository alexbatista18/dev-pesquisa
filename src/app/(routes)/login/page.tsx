"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import db, { app } from "@/firebase/initFirebase";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Buscar usuário no Firestore pelo email
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        toast.error("Usuário não encontrado no banco de dados.");
        return;
      }

      const userData = userDoc.data();

      // Redirecionamento com base no tipo de usuário
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="w-full">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
