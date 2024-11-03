"use client";
import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/types/login-schema";
import { registerSchema } from "@/types/register-schema";
import { emailSignIn } from "@/server/actions/email-signIn";
import { emailRegister } from "@/server/actions/email-register";
import { useAction } from "next-safe-action/hooks";
import FormError from "@/components/login/form-error";
import FormSuccess from "@/components/login/form-success";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";

interface MemberProps {
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function Member({
  onClose,
  initialMode = "login",
}: MemberProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<
    z.infer<typeof loginSchema> | z.infer<typeof registerSchema>
  >({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(isLogin ? {} : { name: "", confirmPassword: "" }),
    },
  });

  const { execute } = useAction(emailSignIn, {
    onSuccess: (data) => {
      if (data.data?.success) {
        setSuccess(data.data.success);
      }
      if (data.data?.error) {
        setError(data.data.error);
      }
    },
  });
  const { execute: registerExecute } = useAction(emailRegister, {
    onSuccess: (data) => {
      if (data.data?.success) {
        setSuccess(data.data.success);
      }
      if (data.data?.error) {
        setError(data.data.error);
      }
    },
  });
  const onSubmit = async (
    data: z.infer<typeof loginSchema> | z.infer<typeof registerSchema>
  ) => {
    if (isLogin) {
      // Handle login
      const loginData = data as z.infer<typeof loginSchema>;

      // Login logic here
      console.log("Login", loginData);
      execute(loginData);
    } else {
      // Handle registration
      const registerData = data as z.infer<typeof registerSchema>;
      // Registration logic here
      console.log("Register", registerData);
      registerExecute(registerData);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="flex z-50 justify-center items-center fixed inset-0 bg-gray-800/80 backdrop-blur-sm animate-in fade-in duration-300 p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <div className="w-full" onClick={(e) => e.stopPropagation()}>
        <Card className="w-full sm:w-[420px] max-w-[420px] mx-auto relative border-none shadow-2xl bg-white/95 dark:bg-gray-900/95">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-5 sm:top-5 text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:rotate-90"
          >
            <IoCloseSharp size={24} />
          </button>

          <CardHeader className="space-y-4 pb-6 pt-6 sm:pb-8 sm:pt-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </CardTitle>
            <p className="text-center text-muted-foreground text-sm px-4 sm:px-6">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Sign up to get started with our service"}
            </p>
          </CardHeader>

          <CardContent className="px-4 sm:px-8 pb-6 sm:pb-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 sm:space-y-7"
              >
                {!isLogin && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {isLogin && (
                        <div className="flex justify-end">
                          <Button
                            variant="link"
                            className="px-0 text-sm font-normal h-auto text-primary hover:text-primary/80"
                            type="button"
                            onClick={() =>
                              (window.location.href = "/auth/reset")
                            }
                          >
                            Forgot password?
                          </Button>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {!isLogin && (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {/* reminder */}
                {success && <FormSuccess message={success} />}
                {error && <FormError message={error} />}

                <Button
                  type="submit"
                  className={
                    "w-full h-11 sm:h-12 font-semibold shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-base"
                  }
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Loading..."
                    : isLogin
                    ? "Sign In"
                    : "Create Account"}
                </Button>

                <div className="relative py-2 sm:py-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 sm:px-4 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  <Button
                    variant="outline"
                    type="button"
                    className="h-11 sm:h-12 hover:bg-primary/5 hover:border-primary transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
                    onClick={() => {
                      setIsLoading(true);
                      signIn("google", { redirect: false, callbackUrl: "/" });
                    }}
                    disabled={isLoading}
                  >
                    <FaGoogle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="h-11 sm:h-12 hover:bg-primary/5 hover:border-primary transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
                    onClick={() => {
                      setIsLoading(true);
                      signIn("github", { redirect: false, callbackUrl: "/" });
                    }}
                    disabled={isLoading}
                  >
                    <FaGithub className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Github
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 underline transition-all duration-200"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      form.reset();
                    }}
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
