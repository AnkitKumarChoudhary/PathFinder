import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from 'react-hot-toast'
import "./globals.css";

export const metadata: Metadata = {
  title: "PathFinder",
  description: "AI-powered career guidance for every student in India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#212529',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#2D6A4F',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E76F51',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
