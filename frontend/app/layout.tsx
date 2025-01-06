import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "@/app/globals.css";
import siteConfig from "@/config/site";
import { Toaster } from "@ui/toaster";

export const metadata: Metadata = {
    title: {
        template: "%s - " + siteConfig.name,
        default: siteConfig.name,
    },
    description: siteConfig.description,
    keywords: ["Movies", "AI", "TMDB", "Recommend", "Recommendations"],
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
                    {children}
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    );
}
