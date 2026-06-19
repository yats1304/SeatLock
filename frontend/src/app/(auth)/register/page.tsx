"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, RegisterFormData } from "@/schemas/auth.schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { registerUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useRedux";
import { User } from "@/types/user";
import { setUser } from "@/slices/authSlice";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerUser(data);

      dispatch(setUser(response.user as User));
      toast.success(response.message);
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden">
      {/* Left Section (Form) */}
      <div className="flex items-center justify-center px-6 animate-slide-rtl">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="space-y-2 mb-6 flex items-center justify-center">
              <div>
                <h2 className="text-3xl font-bold">Create Account</h2>

                <p className="text-muted-foreground text-center">
                  Register to continue
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>

                <Input id="name" placeholder="John Doe" {...register("name")} />

                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                />

                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="pr-9"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    className="pr-9"
                    {...register("confirmPassword")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Register"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Section (Text Info) */}
      <div className="hidden lg:flex items-center justify-center bg-muted px-10 animate-slide-ltr">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-4">SeatLock</h1>

          <p className="text-muted-foreground text-lg">
            Create an account and start reserving seats for upcoming events.
          </p>
        </div>
      </div>
    </div>
  );
}
