import { AuthForm } from "@/views/reusables/auth/AuthForm";
import {  User } from "lucide-react";

export const SignupPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
             <User className="size-4" />
          </div>
         Ability Ltd
        </a>
        <AuthForm mode="register" />
      </div>
    </div>
  );
};
