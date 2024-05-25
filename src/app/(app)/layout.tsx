import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import "@uploadthing/react/styles.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/ui/Navbar";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });
 
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Head>
                <link rel="icon" href="favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <AuthProvider>
                <body className={inter.className}>
                    <Navbar />
                    <Separator />
                    {children}
                    <Toaster />
                </body>
            </AuthProvider>
        </html>
    );
}
