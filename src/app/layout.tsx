import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Autism Screening | Understand Your Child Better",
  description: "The first AI-powered platform in India that screens your child's autism and speech delay risk, connects you to therapists, and empowers you to support them at home.",
  keywords: ["autism", "screening", "AI", "speech delay", "children", "therapy", "india", "autism test"],
  authors: [{ name: "Autism Screening Platform" }],
  openGraph: {
    title: "AI Autism Screening Platform",
    description: "Screen your child's autism and speech delay risk with our AI Avatar.",
    url: "https://autism-frontend-prod-web.onrender.com",
    siteName: "AI Autism Screening",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
