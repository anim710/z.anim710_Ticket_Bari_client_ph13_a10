"use client";
import { useState } from "react";
// 🟢 HeroUI v3 Fix: Imported CardContent instead of CardBody
import { Input, Button, Card, CardContent } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email:    form.email,
        password: form.password,
      });

      localStorage.setItem("tb_token", res.data.token);
      localStorage.setItem("tb_user",  JSON.stringify(res.data.user));

      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const { googleSignIn } = await import("@/lib/auth-client");
      await googleSignIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/google-callback`,
      });
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* 🟢 Cleaned up hardcoded bg-slate classes so HeroUI handles light/dark transitions naturally */}
      <Card className="w-full max-w-md border border-divider shadow-md bg-content1">
        {/* 🟢 HeroUI v3 Fix: Swapped CardBody to CardContent */}
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-600 dark:bg-danger-950/30 dark:border-danger-800 dark:text-danger-400 rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              variant="bordered"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              variant="bordered"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button
              type="submit"
              isLoading={loading}
              color="primary"
              className="w-full font-semibold"
            >
              Login
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-divider" />
            <span className="text-default-400 text-sm">or</span>
            <div className="flex-1 h-px bg-divider" />
          </div>

          {/* 🟢 HeroUI v3 Fix: Changed onPress back to onClick for native button attributes or standard v3 implementation */}
          <Button
            onClick={handleGoogle}
            variant="bordered"
            className="w-full border-default-300 text-default-700 dark:text-default-300 hover:bg-default-100"
          >
            <svg className="w-5 h-5 mr-2 inline" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-default-400 text-sm mt-5">
            No account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}