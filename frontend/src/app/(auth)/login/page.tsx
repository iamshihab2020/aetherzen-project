// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";

import FormInput from "@/components/ui/FormInput";
import LoadingButton from "@/components/ui/LoadingButton";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLoginMutation } from "@/store/auth.api";
import { setCredentials } from "@/store/slices/auth.slice";
export interface ErrorResponse {
  message?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // RTK Query mutation + its status flags
  const [login, { isLoading, error: loginError }] = useLoginMutation();

  // Normalizes RTK Query errors into a simple string
  const parseError = (): string | undefined => {
    if (!loginError) return undefined;

    if ("data" in loginError) {
      const data = loginError.data;

      if (typeof data === "string") {
        return data;
      }

      if (data && typeof data === "object") {
        const errorData = data as ErrorResponse;
        if (errorData.message) {
          return errorData.message;
        }
      }
    }

    // Handle SerializedError
    if ("error" in loginError && loginError.error) {
      return loginError.error;
    }
    // Handle other cases
    return "An unknown error occurred";
  };
  const errorMessage = parseError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          token: response.token,
          user: response.user,
        })
      );
      router.push("/dashboard");
    } catch {
      // all errors surfaced via loginError
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Image */}
      <div className="relative hidden md:block">
        <Image
          src="/images/login-side.jpg"
          alt="Login Visual"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center px-8 sm:px-12 bg-gray-50 relative">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 p-2 rounded-3xl bg-black text-white hover:text-gray-300 transition"
        >
          <ArrowLeft className="h-8 w-8" />
        </Link>

        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 text-center">
            Sign in to your account
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormInput
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={
                  errorMessage?.toLowerCase().includes("email")
                    ? errorMessage
                    : undefined
                }
              />
              <FormInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={
                  errorMessage?.toLowerCase().includes("password")
                    ? errorMessage
                    : undefined
                }
              />
            </div>

            {errorMessage &&
              !/email|password/.test(errorMessage.toLowerCase()) && (
                <div className="text-red-500 text-sm text-center">
                  {errorMessage}
                </div>
              )}

            <div>
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                className="w-full"
              >
                Sign in
              </LoadingButton>
            </div>

            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
