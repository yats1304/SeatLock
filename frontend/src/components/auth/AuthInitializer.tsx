"use client";

import { useEffect } from "react";
import { getProfile } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setUser, setLoading } from "@/slices/authSlice";
import { LoadingScreen } from "@/components/ui/loading";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await getProfile();

        dispatch(setUser(response.user));
      } catch (error) {
        console.log("Not authenticated");
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
