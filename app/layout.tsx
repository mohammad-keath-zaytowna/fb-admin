import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/client-providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard for managing users, products, and orders",
  icons: {
    icon: "/logo_bg.png",
    apple: "/logo_bg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
