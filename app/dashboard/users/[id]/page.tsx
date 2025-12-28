"use client";

import { UserForm } from "@/components/forms/user-form";
import { getUser, updateUser } from "@/lib/api/users";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { UserFormData } from "@/lib/forms/user";

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
        const response = await getUser(userId);
        setUser(response);
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

  const handleSubmit = async (_data: UserFormData) => {
    try {
      setIsLoading(true);

      // Remove empty password fields
      const updateData: any = {
        name: _data.name,
      };

      // Only include password if it's not empty
      if (_data.password && _data.password.length > 0) {
        updateData.password = _data.password;
        updateData.confirmPassword = _data.confirmPassword;
      }

      await updateUser(userId, updateData);
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

