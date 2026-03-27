import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAP Analytics Cloud — Sustainability & Energy Analytics",
  description: "SAP SAC Environment Dashboard — Sales & Distribution · Energy & Retail",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
