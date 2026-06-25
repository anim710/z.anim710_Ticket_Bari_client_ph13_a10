"use client";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Input, Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn.email({ email: form.email, password: form.password });
      const res = await api.post("/auth/jwt", { email: form.email });
      localStorage.setItem("tb_token", res.data.token);
      router.push("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md bg-slate-800 border border-slate-700">
        <CardBody className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Welcome Back
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-blue-600 text-white font-semibold"
            >
              Login
            </Button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-600" />
            <span className="text-slate-400 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-600" />
          </div>

          <Button
            onPress={handleGoogle}
            variant="bordered"
            className="w-full border-slate-600 text-slate-300"
          >
            Continue with Google
          </Button>

          <p className="text-center text-slate-400 text-sm mt-4">
            No account?{" "}
            <Link href="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}