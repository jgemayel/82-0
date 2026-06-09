import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "82-0",
  description: "Build the ultimate NBA all-time team and see if you can go 82-0",
  applicationName: "82-0",
  appleWebApp: { capable: true, title: "82-0", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c101c",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA: installable web app with the generated 82-0 icon */}
        <link rel="manifest" href={`${BASE_PATH}/manifest.webmanifest`} />
        <link rel="icon" href={`${BASE_PATH}/favicon.ico`} sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${BASE_PATH}/favicon-32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${BASE_PATH}/favicon-16.png`}
        />
        <link
          rel="apple-touch-icon"
          href={`${BASE_PATH}/apple-touch-icon.png`}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
