import { createAuthClient } from "better-auth/react";

// BetterAuth client — used ONLY for Google OAuth
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000",
  basePath: "/api/auth/better", // matches our server mount path
});

export const { signIn: googleSignIn, signOut, useSession } = authClient;