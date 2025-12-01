"use client";

import { loginformSchema } from "@/lib/forms/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import RHFInput from "../react-hook-form/rhf-input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { loginApiMethod } from "@/lib/api/auth";

function LoginForm() {
  const form = useForm<z.infer<typeof loginformSchema>>({
    resolver: zodResolver(loginformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const router = useRouter();
  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleSubmit = async (data: z.infer<typeof loginformSchema>) => {
    await loginApiMethod(data);
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <RHFInput
          name="email"
          label="Email"
          type="email"
          placeholder="example@mail.com"
        />
        <RHFInput
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleForgotPassword}
            type="button"
            variant="link"
            className="p-2"
          >
            forgot password?
          </Button>
        </div>
        <Button type="submit" variant="default" className="w-full mt-2 p-6">
          Login
        </Button>
      </form>
    </FormProvider>
  );
}

export default LoginForm;
