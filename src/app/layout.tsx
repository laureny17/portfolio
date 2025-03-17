import type React from "react";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="px-6 sm:px-12 lg:px-15 pt-5 sm:pt-10 overflow-x-hidden overflow-y-auto bg-milk">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
