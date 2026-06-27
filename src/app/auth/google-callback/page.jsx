"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import api from "@/lib/axios";
import { Spinner } from "@heroui/react";

export default function GoogleCallbackPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      // Google login succeeded — save user to our DB + get our JWT
      api.post("/auth/google-save", {
        name:  session.user.name,
        email: session.user.email,
        image: session.user.image,
      })
      .then((res) => {
        localStorage.setItem("tb_token", res.data.token);
        localStorage.setItem("tb_user",  JSON.stringify(res.data.user));
        router.push("/");
      })
      .catch(() => {
        router.push("/login?error=google-failed");
      });
    } else {
      // Session not found — redirect back to login
      router.push("/login");
    }
  }, [session, isPending]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
      <Spinner size="lg" color="primary" />
      <p className="text-slate-400">Completing Google login...</p>
    </div>
  );
}