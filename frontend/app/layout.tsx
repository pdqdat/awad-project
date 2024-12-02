import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "@/app/globals.css";
import { appName, appDescription } from "@/lib/const";

export const metadata: Metadata = {
    title: `${appName}`,
    description: `${appDescription}`,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="antialiased">{children}</body>
            </html>
        </ClerkProvider>
    );
}
