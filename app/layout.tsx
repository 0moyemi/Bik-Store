import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import FirstLoadAnimation from "./components/FirstLoadAnimation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bikudiratillah | Premium Islamic Modest Fashion in Ibadan, Nigeria",
    template: "%s | Bikudiratillah",
  },
  description: "Shop quality abayas, jalabiyas, hijabs, prayer mats and Islamic modest wear in Ibadan. Premium fabrics, elegant designs. Visit us at No. 22 Big Plaza, Oluyole Estate, Ibadan, Nigeria.",
  keywords: [
    "abaya Nigeria",
    "jalabia Ibadan",
    "hijab store Ibadan",
    "prayer mat Nigeria",
    "modest fashion Ibadan",
    "Islamic clothing Nigeria",
    "Muslim fashion Ibadan",
    "Bikudiratillah",
    "modest wear Oluyole",
    "Islamic store Ibadan",
  ],
  authors: [{ name: "Bikudiratillah" }],
  creator: "Bikudiratillah",
  publisher: "Bikudiratillah",
  metadataBase: new URL("https://bikudiratillah.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Bikudiratillah",
    title: "Bikudiratillah | Premium Islamic Modest Fashion in Ibadan",
    description: "Shop quality abayas, jalabiyas, hijabs, prayer mats and Islamic modest wear. Visit our store at No. 22 Big Plaza, Oluyole Estate, Ibadan.",
    locale: "en_NG",
    url: "https://bikudiratillah.com",
    images: ["/og.jpg"], // Easy to update for client projects
  },
  twitter: {
    card: "summary_large_image",
    title: "Bikudiratillah | Premium Islamic Modest Fashion in Ibadan",
    description: "Shop quality abayas, jalabiyas, hijabs, prayer mats and Islamic modest wear in Ibadan.",
    images: ["/og.jpg"], // Easy to update for client projects
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
          #page-content { opacity: 0; }
        `}} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FirstLoadAnimation />
        <div id="page-content">
          <CartProvider>
            {children}
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
