"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - sticky and full height */}
      <div className="sticky top-0 h-screen w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar - sticky */}
        <div className="sticky top-0 z-40">
          <Navbar />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
