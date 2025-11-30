"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import RHFInput from "../react-hook-form/rhf-input";
import { Button } from "../ui/button";
import { resetPasswordformSchema } from "@/lib/forms/auth";

function ResetPasswordForm() {
  const form = useForm<z.infer<typeof resetPasswordformSchema>>({
    resolver: zodResolver(resetPasswordformSchema),
    defaultValues: {
      email: "",
      password: "",
      otp: "",
      confirm_password: "",
    },
    mode: "onChange",
  });
  return (
    <FormProvider {...form}>
      <form className="space-y-4">
        <RHFInput
          disabled
          name="email"
          label="Email Address"
          type="email"
          placeholder="example@mail.com"
        />
        <RHFInput name="otp" label="OTP" type="text" placeholder="123456" />
        <RHFInput
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />
        <RHFInput
          name="confirm_password"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
        />
        <Button type="submit" variant="default" className="w-full mt-2 p-5">
          Reset Password
        </Button>
      </form>
    </FormProvider>
  );
}

export default ResetPasswordForm;
