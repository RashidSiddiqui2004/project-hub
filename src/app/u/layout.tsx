
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/(app)/globals.css";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Mystery Messenger",
  description: "An application for anonymous feedbacks from users.",
};


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
      <body className={inter.className}>
        {children}
        <footer className='text-center p-4 md:p-6'>
          <p className='font-bold'>Mystery Messenger</p>
          <p>&copy; {new Date().getFullYear()} All rights reserved. Made with ❤️ by Rashid </p>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}
