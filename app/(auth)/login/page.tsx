import LoginForm from "@/components/forms/login-form";
import { LoginRedirect } from "@/components/login-redirect";

function LoginPage() {
  return (
    <>
      <LoginRedirect />
      <section className="lg:flex h-full">
        <div className="hidden lg:block flex-3 xl:flex-4 min-h-screen bg-primary-dark">
          <div className="flex flex-col justify-between h-full p-5 text-primary-foreground">
            {/* <Image
              src="/logo_bg.png"
              alt="Logo"
              width={180}
              height={60}
              className="object-contain"
            /> */}
            <div/>
            <div className="p-14">
              <h3 className="text-3xl font-bold ">
                Welcome to the user Service Dashboard
              </h3>
              <h3 className="text-2xl mt-5 ">
                Your all-in solution for your page management
              </h3>
            </div>
            <h2>@2025</h2>
          </div>
        </div>
        <div className="flex-4 min-h-screen flex flex-col items-center justify-center lg:px-30 px-5 py-30 ">
          <div className="lg:min-w-lg w-full">
            <h3 className="text-2xl font-bold mb-10">Log in to your account</h3>
            <LoginForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
