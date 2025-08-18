"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  ShoppingBag,
  UploadCloud,
  Users,
  LogOut,
  User as UserIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/store/store";
import { useLogoutMutation } from "@/store/slices/auth.api";
import { logout as clearAuth } from "@/store/slices/auth.slice";
import { Badge } from "../ui/badge";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { user } = useSelector((state: RootState) => state.auth);

  //logout mutation
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  //  logout flow
  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap();
      dispatch(clearAuth());
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // static top-level links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Featured", href: "/featured" },
    { name: "Products", href: "/products" },
    { name: "For Hospitals", href: "/for-hospitals" },
    { name: "Contact", href: "/contact" },
  ];

  // role-specific links
  const roleLinks = {
    HOSPITAL_ADMIN: [
      { name: "Dashboard", href: "/dashboard/products" },
      { name: "Inventory", href: "/inventory" },
      { name: "Orders", href: "/orders" },
      { name: "Reports", href: "/reports" },
    ],
    DOCTOR: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Prescriptions", href: "/prescriptions" },
      { name: "Patients", href: "/patients" },
    ],
    PATIENT: [
      { name: "My Orders", href: "/my-orders" },
      { name: "Prescriptions", href: "/my-prescriptions" },
    ],
  };
  const userLinks = user
    ? roleLinks[user.role as keyof typeof roleLinks] || []
    : [];

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 flex justify-between items-center">
        <p className="hidden sm:block">Mon - Fri: 8:00 am - 7:00 pm</p>
        <div className="flex items-center gap-4 text-center">
          <span>Sign up & get 20% off</span>
          <Link href="/dashboard/docs" className="underline hidden sm:block">
            API Docs
          </Link>
        </div>
        <p className="hidden sm:block">English | USD</p>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-red-600">AetherZen</span>
          <span className="hidden sm:inline text-base font-medium text-gray-700">
            MediProcure
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 items-center max-w-xl mx-8">
          <Input
            placeholder="Search products, devices or certifications"
            className="rounded-r-none focus:ring-0"
          />
          <Button className="rounded-l-none" type="submit">
            Search
          </Button>
        </div>

        {/* Icons + Auth */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            asChild
            className="hidden md:flex items-center gap-2"
          >
            <Link href="/prescription/upload">
              <UploadCloud className="h-5 w-5" />
              <span className="hidden lg:inline text-sm">Upload</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            asChild
            className="hidden md:flex items-center gap-2"
          >
            <Link href="/for-hospitals">
              <Users className="h-5 w-5" />
              <span className="hidden lg:inline text-sm">Hospitals</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {hasMounted &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                          user.name || user.email
                        }`}
                        alt={user.name || user.email}
                      />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                            user.name || user.email
                          }`}
                          alt={user.name || user.email}
                        />
                        <AvatarFallback>
                          <UserIcon className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <Badge variant={"destructive"}>
                      {user.role.split("_").join(" ")}
                    </Badge>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            ))}

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </Button>
        </div>
      </div>

      {/* Desktop Nav Links */}
      <nav className="hidden md:flex justify-center gap-8 bg-gray-50 py-3 border-t">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-sm font-medium text-gray-700 hover:text-red-600"
          >
            {link.name}
          </Link>
        ))}

        {hasMounted &&
          userLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-red-600"
            >
              {link.name}
            </Link>
          ))}
      </nav>

      {/* Mobile Nav Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-gray-700 hover:text-red-600"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {hasMounted &&
              userLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-700 hover:text-red-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
          </div>

          <div className="border-t px-4 py-6 space-y-4">
            <Link
              href="/prescription/upload"
              className="flex items-center gap-2 text-gray-700 hover:text-red-600"
              onClick={() => setMobileOpen(false)}
            >
              <UploadCloud /> Upload Prescription
            </Link>

            <Link
              href="/for-hospitals"
              className="flex items-center gap-2 text-gray-700 hover:text-red-600"
              onClick={() => setMobileOpen(false)}
            >
              <Users /> For Hospitals
            </Link>
          </div>

          {hasMounted && (
            <div className="border-t px-4 py-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                          user.name || user.email
                        }`}
                        alt="user avatar"
                      />
                      <AvatarFallback>
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge variant={"destructive"} className="mt-1">
                        {user.role.split("_").join(" ")}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </Button>
                </div>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                </Button>
              )}
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
