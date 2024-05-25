import { Inter } from "next/font/google";
import "@/app/(app)/globals.css";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import Navbar from "@/components/ui/Navbar";
import AuthProvider from "@/context/AuthProvider";
import Footer from "@/components/ui/Footer";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <Head>
                <link rel="icon" href="/vercel.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <AuthProvider>
                <body className={inter.className}>
                    <Navbar />
                    {children} 
                    <Toaster />
                    <Footer/>
                </body>
            </AuthProvider>
    
        </html>
    )
}
