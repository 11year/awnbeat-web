import type { Metadata } from "next";
import { Anybody } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";

const anybody = Anybody({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-anybody",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Awnbeat — Find Your Community",
  description: "Awnbeat connects you to local wellness, sports, and activity communities. Rediscover the social side of staying active.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={anybody.variable}>
      <body className="font-anybody antialiased bg-transparent text-brand-text">
        <PageBackground />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
