"use client";
import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { Input, Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      // Get JWT from our server
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
            Create Account
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              classNames={{ input: "bg-slate-700 text-white" }}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              classNames={{ input: "bg-slate-700 text-white" }}
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              classNames={{ input: "bg-slate-700 text-white" }}
            />
            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-blue-600 text-white font-semibold"
            >
              Register
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
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}