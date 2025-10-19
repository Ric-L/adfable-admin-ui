// app/layout.tsx
import ClientProviders from "@/components/ClientProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Afdable Classes - Admin Panel",
  description: "Professional admin panel for Afdable Classes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
