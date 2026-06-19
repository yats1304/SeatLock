"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import {
  CalendarDays,
  LayoutDashboard,
  Ticket,
  User,
  LogOut,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logoutUser } from "@/services/auth.service";
import { clearUser, setLoading } from "@/slices/authSlice";

export default function Navbar() {
  const pathname = usePathname();

  const dispatch = useAppDispatch();

  const { user, isAuth } = useAppSelector((state) => state.auth);

  const logoutHandler = async () => {
    try {
      dispatch(setLoading(true));
      const response = await logoutUser();

      dispatch(clearUser());

      toast.success(response.message || "Logged out successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Logout failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const links = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/events",
      label: "Events",
      icon: CalendarDays,
    },
  ];

  if (isAuth) {
    links.push(
      {
        href: "/reservations",
        label: "Reservations",
        icon: Ticket,
      },
      {
        href: "/bookings",
        label: "Bookings",
        icon: Ticket,
      },
    );
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          SeatLock
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <ThemeToggle />

          {!isAuth ? (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar>
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 mt-4">
                <div className="px-2 py-1.5">
                  <p className="font-medium">{user?.name}</p>

                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-red-500"
                  onClick={logoutHandler}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="flex flex-col">
              <div className="flex flex-col flex-1 mt-6 px-4">
                <h2 className="text-xl font-bold tracking-tight mb-8">
                  SeatLock
                </h2>

                <nav className="flex flex-col gap-2">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon size={18} />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto flex flex-col gap-4">
                  {!isAuth ? (
                    <Link href="/login">
                      <Button className="w-full">Login</Button>
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                          <Avatar className="h-9 w-9 border">
                            <AvatarFallback>
                              {user?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {user?.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-40">
                              {user?.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <User size={18} />
                          My Profile
                        </Link>

                        <button
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors w-full text-left"
                          onClick={logoutHandler}
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
