// src/app/layout.tsx

import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google"; // Import the font function
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext'; // Keep this for dark mode

// Initialize the font, assign it to a NEW variable name, e.g., robotoMono (camelCase is common for instances)
const robotoMono = Roboto_Mono({ // Call the imported Roboto_Mono function
  subsets: ["latin"],
  variable: "--font-roboto-mono", // Optional: if you want to use it as a CSS variable
  // weight: ['400', '700'], // Optional: specify weights if needed
  // style: ['normal', 'italic'], // Optional: specify styles
});

export const metadata: Metadata = {
  title: 'MOC Finder', // Updated title
  description: 'Find alternate builds for your LEGO sets', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={robotoMono.variable}> {/* Optional: if using CSS variable for html/body */}
      {/* Apply the font class to the body. If using CSS variable for html, this might just need base styling. */}
      {/* Or directly apply the font class: className={robotoMono.className} */}
      <body className={robotoMono.className}> {/* << USE THE INITIALIZED FONT'S CLASSNAME */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
