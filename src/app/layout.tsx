import type { Metadata, Viewport } from "next";
import { dir, locale, t } from "@/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: t("app.name"),
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={locale} dir={dir}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
