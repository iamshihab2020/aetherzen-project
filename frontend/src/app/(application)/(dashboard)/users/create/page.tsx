"use client";

import { useState, useEffect } from "react";
import { useAdminCreateUserMutation } from "@/store/auth.api";
import ProtectedRoute from "@/providers/ProtectedRoute";
import { CreateUserForm } from "@/types/types";
import { UserRole } from "@/types/auth";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Briefcase,
  Shield,
  Heart,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const AdminCreateUserPage = () => {
  const [form, setForm] = useState<CreateUserForm>({
    name: "",
    email: "",
    password: "",
    role: "DOCTOR",
  });

  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const [createUser, { isLoading, error }] = useAdminCreateUserMutation();

  const errorMessage = (() => {
    if (!error) return undefined;
    if ("data" in error && (error.data as { message?: string })?.message)
      return (error.data as { message: string }).message;
    if ("error" in error) return String(error.error);
    return JSON.stringify(error);
  })();

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (form.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(form.password)) strength += 1;
    if (/[0-9]/.test(form.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) strength += 1;
    setPasswordStrength(strength);
  }, [form.password]);

  const handleSubmit = async () => {
    try {
      await createUser(form).unwrap();
      setForm({ name: "", email: "", password: "", role: "DOCTOR" });
      toast.success(
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
          <span>User created successfully!</span>
        </div>,
        { position: "top-right", autoClose: 3000 }
      );
    } catch (err) {
      toast.error(
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
          <span>Failed to create user: {errorMessage || "Unknown error"}</span>
        </div>,
        { position: "top-right", autoClose: 5000 }
      );
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    const texts = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    return texts[passwordStrength];
  };

  const roleOptions = [
    {
      value: "DOCTOR",
      label: "Doctor",
      icon: <Heart className="text-pink-500" />,
    },
    {
      value: "HOSPITAL_ADMIN",
      label: "Hospital Admin",
      icon: <Shield className="text-blue-500" />,
    },
    {
      value: "PATIENT",
      label: "Patient",
      icon: <User className="text-green-500" />,
    },
  ];

  return (
    <ProtectedRoute requiredRoles={["HOSPITAL_ADMIN"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
        <ToastContainer />
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New User
            </h1>
            <p className="text-gray-600">
              Add new users to your healthcare system with appropriate roles
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="space-y-6">
                {/* Personal Info Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <User className="mr-2 text-gray-500 h-5 w-5" />
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="john.doe@example.com"
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Lock className="mr-2 text-gray-500 h-5 w-5" />
                    Account Security
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          id="password"
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="••••••••"
                          value={form.password}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, password: e.target.value }))
                          }
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {form.password && (
                        <div className="mt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-gray-500">
                              Password strength
                            </span>
                            <span
                              className={`text-xs font-medium ${passwordStrength > 2 ? "text-green-600" : passwordStrength > 1 ? "text-yellow-600" : "text-red-600"}`}
                            >
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getPasswordStrengthColor()} transition-all duration-300`}
                              style={{ width: `${passwordStrength * 25}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Briefcase className="mr-2 text-gray-500 h-5 w-5" />
                    User Role
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                          form.role === option.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            role: option.value as UserRole,
                          }))
                        }
                      >
                        <div className="mb-2 text-2xl">{option.icon}</div>
                        <span className="text-sm font-medium text-gray-700">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-3.5 px-4 rounded-xl font-medium text-white transition-all ${
                      isLoading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-5 w-5 mr-3 text-white" />
                        Creating User...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <UserPlus className="h-5 w-5 mr-2" />
                        Create User
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Ensure all information is accurate before creating a new user
              account.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminCreateUserPage;
