import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/home-page/nav";
import AuthProvider from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "Travel",
  description: "Plan your next trip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="relative">
            <Nav />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
