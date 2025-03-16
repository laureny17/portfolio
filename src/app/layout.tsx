import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="pl-15 pr-15 pt-10 overflow-x-hidden bg-milk">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
