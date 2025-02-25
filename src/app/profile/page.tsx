"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const { user } = session;

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="text-lg">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-medium">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Account Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p>{user.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p>{user.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Account ID</p>
                  <p className="font-mono">{user.id}</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-medium">Image Analysis</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Analyses</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Join our program to get more detailed analytics and usage reports.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}