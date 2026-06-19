"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordSchema,
  ChangePasswordFormData,
} from "@/schemas/auth.schema";
import { changePassword, logoutUser } from "@/services/auth.service";
import { clearUser } from "@/slices/authSlice";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/loading";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  User as UserIcon,
  Mail,
  Lock,
  KeyRound,
  ShieldAlert,
  LogOut,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { user, isAuth, loading: authLoading } = useAppSelector((state) => state.auth);
  
  const [submitting, setSubmitting] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuth) {
      router.push("/login");
    }
  }, [isAuth, authLoading, router]);

  if (authLoading || !user) {
    return <LoadingScreen />;
  }

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setSubmitting(true);
      await changePassword(data.currentPassword, data.newPassword);
      toast.success("Password changed successfully!");
      reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setIsPasswordModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await logoutUser();
      dispatch(clearUser());
      toast.success(response.message || "Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Logout failed");
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  // Get user initials
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings and security preferences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 border border-border h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="relative flex items-center justify-center h-24 w-24 rounded-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-3xl font-bold shadow-lg">
              {initials}
              <div className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-card h-6 w-6 rounded-full" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
            </div>
            <div className="w-full pt-4 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <UserIcon className="h-3.5 w-3.5" />
              Account ID: {user._id.slice(-8)}
            </div>
          </CardContent>
        </Card>

        {/* Settings & Actions Card */}
        <Card className="md:col-span-2 border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              Account & Security
            </CardTitle>
            <CardDescription>
              Manage your password and active session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Change Password row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-muted/40 border border-border/50">
              <div className="space-y-1">
                <p className="font-semibold text-sm">Change Password</p>
                <p className="text-xs text-muted-foreground">
                  Update your password regularly to keep your account safe.
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2 shrink-0 cursor-pointer"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </Button>
            </div>

            {/* Logout row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-red-500/5 border border-red-500/10">
              <div className="space-y-1">
                <p className="font-semibold text-sm text-red-500">Sign Out</p>
                <p className="text-xs text-muted-foreground">
                  Disconnect your session from this browser.
                </p>
              </div>
              <Button
                variant="destructive"
                className="gap-2 shrink-0 cursor-pointer"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          if (!submitting) {
            setIsPasswordModalOpen(false);
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            reset();
          }
        }}
        title="Change Password"
        description="Fill out the fields below to update your security credentials."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="pl-10 pr-10"
                {...register("currentPassword")}
                aria-invalid={!!errors.currentPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pl-10 pr-10"
                {...register("newPassword")}
                aria-invalid={!!errors.newPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                {errors.newPassword.message}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Password must be at least 8 characters and contain at least one uppercase letter, lowercase letter, and number.
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setShowCurrentPassword(false);
                setShowNewPassword(false);
                reset();
              }}
              disabled={submitting}
              className="sm:w-auto w-full cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="sm:w-auto w-full cursor-pointer" disabled={submitting}>
              {submitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out? You will need to log back in to access your dashboard, bookings, and reservations."
        confirmText="Logout"
        cancelText="Cancel"
        isLoading={isLoggingOut}
        variant="destructive"
      />
    </div>
  );
}
