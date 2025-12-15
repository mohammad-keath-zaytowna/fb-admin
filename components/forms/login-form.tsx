"use client";

import { loginformSchema } from "@/lib/forms/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import RHFInput from "../react-hook-form/rhf-input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { loginApiMethod } from "@/lib/api/auth";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof loginformSchema>>({
    resolver: zodResolver(loginformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { login } = useAuthContext();

  const router = useRouter();
  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleSubmit = async (data: z.infer<typeof loginformSchema>) => {
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    const response = await loginApiMethod(data);
    if (response) {
      await login(response);
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(handleSubmit)();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <RHFInput
          name="email"
          label="Email"
          type="email"
          placeholder="example@mail.com"
          disabled={isLoading}
        />
        <RHFInput
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
        />
        {/* <div className="flex justify-end">
          <Button
            onClick={handleForgotPassword}
            type="button"
            variant="link"
            className="p-2"
            disabled={isLoading}
          >
            forgot password?
          </Button>
        </div> */}
        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="w-full mt-2 p-6"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </FormProvider>
  );
}

export default LoginForm;
