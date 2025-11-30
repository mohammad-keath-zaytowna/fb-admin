"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import RHFInput from "../react-hook-form/rhf-input";
import { Button } from "../ui/button";
import { forgotPasswordFormSchema } from "@/lib/forms/auth";

function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });
  return (
    <FormProvider {...form}>
      <form className="space-y-4">
        <RHFInput
          name="email"
          label="Email Address"
          type="email"
          placeholder="example@mail.com"
        />
        <Button type="submit" variant="default" className="w-full mt-2 p-5">
          Send Reset Link
        </Button>
      </form>
    </FormProvider>
  );
}

export default ForgotPasswordForm;
