"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoginFormData, loginSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useRedux";
import toast from "react-hot-toast";
import { setUser } from "@/slices/authSlice";
import type { User } from "@/types/user";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data);

      dispatch(setUser(response.user as User));
      toast.success(response.message);
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden">
      {/* Left Section */}
      <div className="hidden lg:flex items-center justify-center bg-muted px-10 animate-slide-rtl">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-4">SeatLock</h1>

          <p className="text-muted-foreground text-lg">
            Reserve seats, manage reservations, and confirm bookings seamlessly.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center px-6 animate-slide-ltr">
        <Card className="w-full max-w-md border-1.5">
          <CardContent className="pt-6">
            <div className="space-y-2 mb-6 flex items-center justify-center">
              <div>
                <h2 className="text-3xl font-bold">Welcome Back</h2>

                <p className="text-muted-foreground text-center">
                  Login to continue
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
