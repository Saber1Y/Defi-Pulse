import type { Metadata } from "next";
import { Bree_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";


const breeSerif = Bree_Serif({
  variable: "--font-bree-serif",
  subsets: ["latin"],
  weight: "400",
});


export const metadata: Metadata = {
  title: "DeFi Pulse",
  description: "Real-time DeFi dashboard on Somnia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${breeSerif.variable}  antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
