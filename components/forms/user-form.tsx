"use client";

import { userFormSchema, UserFormData } from "@/lib/forms/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import RHFInput from "../react-hook-form/rhf-input";
import { Button } from "../ui/button";
import { User } from "@/types";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading = false }: UserFormProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: UserFormData) => {
    await onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <RHFInput
          name="name"
          label="Name"
          type="text"
          placeholder="John Doe"
          disabled={isLoading}
        />
        <RHFInput
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          disabled={isLoading || !!initialData}
        />

        {!initialData && (
          <>
            <RHFInput
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <RHFInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </>
        )}
        {initialData && (
          <p className="text-sm text-muted-foreground">
            Leave password fields empty to keep current password
          </p>
        )}
        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="w-full mt-2 p-6"
        >
          {isLoading ? "Saving..." : initialData ? "Update User" : "Create User"}
        </Button>
      </form>
    </FormProvider>
  );
}

