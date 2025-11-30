import ForgotPasswordForm from "@/components/forms/forgot-password-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function ForgotPasswordPage() {
  return (
    <section className="flex h-full min-h-screen justify-center items-center">
      <div className="flex flex-col gap-3 max-w-xl">
        <h1 className="text-2xl font-bold text-center">
          Forgot Your Password?
        </h1>
        <p className="text-md text-center">
          Enter the email address associated with your account and we&apos;ll
          send you a link to reset your password
        </p>
        <Card className="w-full p-8 mt-12 mb-5">
          <ForgotPasswordForm />
        </Card>
        <div className="flex justify-center">
          <Button type="submit" variant="link" className=" p-2">
            Back to Login
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
