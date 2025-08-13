"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, ShoppingBag, UploadCloud, Users, LogOut } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import { useLogoutMutation } from "@/store/auth.api";
import { logout as clearAuth } from "@/store/slices/auth.slice";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // mark component as mounted on client
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { user } = useSelector((state: RootState) => state.auth);

  // RTK Query logout mutation
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Trigger logout flow
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
      { name: "Dashboard", href: "/dashboard" },
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
    <header className="border-b bg-white sticky top-0 z-50">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 flex justify-between items-center">
        <p>Mon - Fri: 8:00 am - 7:00 pm</p>
        <div className="flex items-center gap-4">
          <span>Sign up & get 20% off</span>
          <Link href="/admin/docs" className="underline">
            API Docs
          </Link>
        </div>
        <p className="hidden sm:block">English | USD</p>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto flex justify-between items-center py-4 px-5 md:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-red-600">AetherZen</span>
          <span className="text-base font-medium text-gray-700">
            MediProcure
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-1/2">
          <Input
            placeholder="Search products, devices or certifications"
            className="rounded-r-none"
          />
          <Button className="rounded-l-none">Search</Button>
        </div>

        {/* Icons + Auth */}
        <div className="flex items-center gap-4">
          <Link
            href="/prescription/upload"
            className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600"
          >
            <UploadCloud />
            <span className="text-sm">Upload Prescription</span>
          </Link>

          <Link
            href="/for-hospitals"
            className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600"
          >
            <Users />
            <span className="text-sm">For Hospitals</span>
          </Link>

          <Link href="/cart" className="text-gray-700 hover:text-red-500">
            <ShoppingBag />
          </Link>

          {hasMounted &&
            (user ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600"
              >
                <LogOut size={16} /> Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            ))}

          <Button
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </Button>
        </div>
      </div>

      {/* Desktop Nav Links */}
      <nav className="hidden md:flex justify-center gap-8 bg-gray-50 py-2 border-t">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-gray-700 hover:text-red-600"
          >
            {link.name}
          </Link>
        ))}

        {hasMounted &&
          userLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-red-600"
            >
              {link.name}
            </Link>
          ))}
      </nav>

      {/* Mobile Nav Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-gray-50 py-4 px-6 flex flex-col gap-4 border-t">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-red-600"
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}

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

          {hasMounted &&
            userLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-red-600"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}

          {hasMounted &&
            (user ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-red-600"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            ))}
        </nav>
      )}
    </header>
  );
}
