"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth(Component: React.ComponentType, requireAuth: boolean) {
  return function AuthenticatedComponent(props: any) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) return; // Wait until auth state is resolved

      if (requireAuth && !isAuthenticated) {
        // Protected page, user not logged in
        router.replace("/login");
      } else if (!requireAuth && isAuthenticated) {
        // Guest page, user is logged in
        router.replace("/dashboard");
      }
      // Otherwise, allow access
    }, [isAuthenticated, loading, router, requireAuth]);

    if (loading) {
      return <p>Loading...</p>; // Show while checking auth
    }

    // Only render the component if conditions are met
    if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
      return <Component {...props} />;
    }

    // Redirecting, don’t render anything
    return null;
  };
}
