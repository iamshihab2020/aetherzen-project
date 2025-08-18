"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  FileText,
  Users,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Bell,
  UserIcon,
  PackageCheck,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
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
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLogoutMutation } from "@/store/slices/api.slice";
import { logout as clearAuth } from "@/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap();
      dispatch(clearAuth());
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/dashboard/products",
      label: "Products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      href: "/dashboard/categories",
      label: "Categories",
      icon: <ListOrdered className="h-5 w-5" />,
    },
    {
      href: "/dashboard/orders",
      label: "Orders",
      icon: <PackageCheck className="h-5 w-5" />,
    },
    {
      href: "/dashboard/prescriptions",
      label: "Prescriptions",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen">
      <TooltipProvider delayDuration={0}>
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col bg-gray-900 text-white border-r border-gray-800 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          <div
            className={cn(
              "p-5 border-b border-gray-800 flex items-center justify-between",
              isCollapsed && "justify-center"
            )}
          >
            {!isCollapsed && (
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="text-white hover:bg-red-800 hover:text-white"
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </Button>
          </div>

          <nav className="p-3 flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-gray-300 hover:bg-red-800 hover:text-white transition-colors group",
                          isCollapsed ? "justify-center" : "",
                          pathname === item.href ? "bg-red-600 text-white" : ""
                        )}
                      >
                        <span
                          className={
                            pathname === item.href
                              ? "text-white"
                              : "text-gray-400"
                          }
                        >
                          {item.icon}
                        </span>
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent
                        side="right"
                        className="bg-red-800 text-white border-gray-700"
                      >
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={cn(
              "p-4 border-t border-gray-800",
              isCollapsed ? "flex justify-center" : ""
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-800"
                >
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                        user?.name || user?.email
                      }`}
                      alt={user?.name || user?.email}
                    />
                    <AvatarFallback>
                      <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col text-left">
                      <span className="font-medium">
                        {user?.name || user?.email}
                      </span>
                      <span className="text-xs text-gray-400">
                        {user?.role.split("_").join(" ")}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 text-white border-gray-700">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs text-gray-400 font-normal">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
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
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="md:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu size={22} />
                </Button>
                <Link href="/" className="font-bold text-lg flex items-center">
                  <span>AetherZen</span>
                  <span className="text-red-600">MediProcure</span>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>

                {user && (
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
                )}
              </div>
            </div>
          </header>

          {/* Mobile Sidebar */}
          {mobileOpen && (
            <div className="md:hidden fixed inset-0 z-30">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-64 bg-gray-900 text-white z-40 p-4">
                <div className="flex justify-between items-center p-5 border-b border-gray-800">
                  <h1 className="text-xl font-bold">Admin Dashboard</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </Button>
                </div>
                <nav className="p-3">
                  <ul className="space-y-1">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white",
                            pathname === item.href
                              ? "bg-gray-800 text-white"
                              : ""
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span
                            className={
                              pathname === item.href
                                ? "text-white"
                                : "text-gray-400"
                            }
                          >
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="p-4 border-t border-gray-800">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                          user?.name || user?.email
                        }`}
                        alt={user?.name || user?.email}
                      />
                      <AvatarFallback>
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user?.name || user?.email}
                      </span>
                      <span className="text-sm text-gray-400">
                        {user?.role.split("_").join(" ")}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full mt-4 justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <main className="min-h-screen w-full p-4 md:p-6 overflow-auto bg-gray-50">
            {children}
          </main>
        </main>
      </TooltipProvider>
    </div>
  );
};

export default DashboardLayout;
