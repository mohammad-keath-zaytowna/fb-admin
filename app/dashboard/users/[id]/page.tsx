"use client";

import { UserForm } from "@/components/forms/user-form";
import { getUsers, UserFormData } from "@/lib/api/users";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";

function EditUserContent() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoadingUser(true);
        const response = await getUsers({ page: 1, rowsPerPage: 1000 });
        const foundUser = response.users.find((u) => u._id === userId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          router.push("/dashboard/users");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/dashboard/users");
      } finally {
        setIsLoadingUser(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, router]);

  const handleSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      // Note: Backend doesn't have update user endpoint, only status update
      // This would need to be implemented in the backend
      // For now, we'll just redirect
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">Loading user...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>Update user information</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm initialData={user} onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditUserPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <EditUserContent />
    </Suspense>
  );
}

