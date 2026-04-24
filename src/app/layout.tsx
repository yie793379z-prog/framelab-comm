import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { LanguageProvider } from "@/i18n/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "FrameLab",
  description: "A lightweight coding workspace for communication and media studies students."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AppHeader />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
