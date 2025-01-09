import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";

import "@/app/globals.css";
import siteConfig from "@/config/site";
import { Toaster } from "@ui/sonner";

export const metadata: Metadata = {
    title: {
        template: "%s - " + siteConfig.name,
        default: siteConfig.name,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="antialiased">
                    <NextTopLoader
                        color="linear-gradient(to right, rgb(239, 68, 68), rgb(220, 38, 38))"
                        height={4}
                    />
                    {children}
                    <Toaster
                        position="top-right"
                        richColors
                        visibleToasts={5}
                    />
                </body>
            </html>
        </ClerkProvider>
    );
}
