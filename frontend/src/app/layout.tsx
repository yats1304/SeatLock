import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProvider from "@/providers/provider";
import { Toaster } from "react-hot-toast";
import AuthInitializer from "@/components/auth/AuthInitializer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SeatLock",
  description: "A real-time event booking and seat reservation system with live status tracking, locking, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="bg-background text-foreground">
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthInitializer>{children}</AuthInitializer>
            <Toaster
              position="top-right"
              toastOptions={{ duration: 3000 }}
              containerClassName="mt-14"
            />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
