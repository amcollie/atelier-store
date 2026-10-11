import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const brandSans = Hanken_Grotesk({
  variable: "--font-brand-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Atelier | Considered clothing and accessories",
    template: "%s | Atelier",
  },
  description:
    "Considered clothing and accessories in natural materials, built to be worn for years.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${brandSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
