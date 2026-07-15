import { createAuthClient } from "better-auth/react";

// Same-origin Better Auth (proxied via next.config rewrites to the API).
// Point this at the *frontend* origin, never directly at the Render API URL.
const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const authClient = createAuthClient({
  baseURL,
  basePath: "/api/auth/better",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn: googleSignIn, signOut, useSession } = authClient;
