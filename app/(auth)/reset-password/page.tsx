import ResetPasswordForm from "@/components/forms/reset-password-form";
import { Card } from "@/components/ui/card";

function ForgotPasswordPage() {
  return (
    <section className="flex h-full min-h-screen  justify-center items-center">
      <Card className="w-full p-8 mt-12 mb-5 max-w-xl">
        <h2 className="text-2xl font-bold text-center">Set a New Password</h2>
        <p className="text-md text-center">
          Your new password must be different from previously used passwords
        </p>
        <ResetPasswordForm />
      </Card>
    </section>
  );
}

export default ForgotPasswordPage;
