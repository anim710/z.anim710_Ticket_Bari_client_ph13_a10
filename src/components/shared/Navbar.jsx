"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Switch,
} from "@heroui/react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import { Bus } from "@gravity-ui/icons";

export default function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "All Tickets", href: "/tickets" },
    ...(session ? [{ label: "Dashboard", href: "/dashboard/profile" }] : []),
  ];

  return (
    <Navbar
      isMenuOpen={isOpen}
      onMenuOpenChange={setIsOpen}
      className="bg-slate-900 border-b border-slate-800 fixed top-0 z-50"
      maxWidth="xl"
    >
      {/* Logo */}
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <Bus className="text-blue-500 w-6 h-6" />
            <span className="font-bold text-xl text-white">
              Ticket<span className="text-blue-500">Bari</span>
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop nav links */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-blue-400"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right side */}
      <NavbarContent justify="end" className="gap-3">
        {/* Dark/Light toggle */}
        <Switch
          size="sm"
          isSelected={theme === "dark"}
          onValueChange={(v) => setTheme(v ? "dark" : "light")}
        />

        {session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                src={session.user?.image || ""}
                name={session.user?.name}
                size="sm"
                className="cursor-pointer"
              />
            </DropdownTrigger>
            <DropdownMenu className="bg-slate-800">
              <DropdownItem key="name" isReadOnly className="text-slate-300">
                {session.user?.name}
              </DropdownItem>
              <DropdownItem key="profile" as={Link} href="/dashboard/profile">
                My Profile
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => signOut()}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex gap-2">
            <Button
              as={Link}
              href="/login"
              variant="ghost"
              size="sm"
              className="text-slate-300 border-slate-600"
            >
              Login
            </Button>
            <Button
              as={Link}
              href="/register"
              size="sm"
              className="bg-blue-600 text-white"
            >
              Register
            </Button>
          </div>
        )}
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="bg-slate-900 pt-4">
        {navItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              href={item.href}
              className="text-slate-300 hover:text-white text-lg"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}