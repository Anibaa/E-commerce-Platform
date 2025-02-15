import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { AuthModalProvider } from "@/context/AuthModalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcommStore",
  description: "Your one-stop shop for everything",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthModalProvider>
            {children}
          </AuthModalProvider>
        </Providers>
      </body>
    </html>
  );
}
