// src/app/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";

import FormInput from "@/components/ui/FormInput";
import LoadingButton from "@/components/ui/LoadingButton";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRegisterMutation } from "@/store/slices/auth.api";
import { setCredentials } from "@/store/slices/auth.slice";
export interface ErrorResponse {
  message?: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // RTK Query mutation + its status flags
  const [register, { isLoading, error: registerError }] = useRegisterMutation();

  // Normalize RTK Query errors into a simple string
  const parseError = (): string | undefined => {
    if (!registerError) return undefined;

    // Handle FetchBaseQueryError with data
    if ("data" in registerError) {
      const data = registerError.data;

      // Handle string error data
      if (typeof data === "string") {
        return data;
      }

      // Handle object error data with message
      if (data && typeof data === "object") {
        const errorData = data as ErrorResponse;
        if (errorData.message) {
          return errorData.message;
        }
      }
    }

    // Handle SerializedError
    if ("error" in registerError && registerError.error) {
      return registerError.error;
    }
    // Handle other cases
    return "An unknown error occurred";
  };
  const errorMessage = parseError();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSelectChange = (value: string) => {
  //   setFormData((prev) => ({ ...prev, role: value }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(formData).unwrap();
      dispatch(
        setCredentials({
          token: response.token,
          user: response.user,
        })
      );
      router.push("/dashboard");
    } catch {
      // all errors surfaced via registerError
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Image */}
      <div className="relative hidden md:block">
        <Image
          src="/images/register-side.jpg"
          alt="Register Visual"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center px-8 sm:px-12 bg-gray-50 relative">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 p-2 rounded-3xl bg-black text-white hover:text-gray-300 transition"
        >
          <ArrowLeft className="h-8 w-8" />
        </Link>

        <div className="max-w-md w-full space-y-8 bg-white p-5 lg:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 text-center">
            Create a new account
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={
                  errorMessage?.toLowerCase().includes("email")
                    ? errorMessage
                    : undefined
                }
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
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
                Register
              </LoadingButton>
            </div>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
