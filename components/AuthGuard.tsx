// components/AuthGuard.tsx
import { useSupabaseSession } from "@/context/SupabaseProvider";
import { Redirect } from "expo-router";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = useSupabaseSession();
  if (!session) return <Redirect href="./login" />;
  return <>{children}</>;
}
