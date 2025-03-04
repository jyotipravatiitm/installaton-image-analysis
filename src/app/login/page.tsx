"use client";

import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-muted/30">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to continue to Image Analysis
          </p>
        </div>
        
        <div className="space-y-4">
          <LoginButton className="w-full" />
          
          <div className="text-center text-sm">
            <p>
              Don&apos;t want to sign in?{" "}
              <Button variant="link" asChild>
                <Link href="/" className="underline">Continue as guest</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
