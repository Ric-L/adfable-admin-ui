"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Users, UserCheck, Video, Menu, X, GraduationCap } from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: GraduationCap },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Enrollment Requests", href: "/admin/enrollment-requests", icon: UserCheck },
  { name: "Live Classes", href: "/admin/live-classes", icon: Video },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 h-screen",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-white text-gray-500">
            <Image alt="logo" src={"/logo.png"} width={50} height={50} />
            <span className="text-xl font-bold">Afdable Classes</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive ? "bg-blue-100 text-blue-700 border-r-4 border-blue-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">© 2025 Afdable Classes</p>
          </div>
        </div>
      </div>
    </>
  );
}
