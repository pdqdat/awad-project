import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
    const {
        userId,
    }: {
        userId: string | null;
    } = await auth();

    // Redirect to the homepage if the user is already logged in
    if (userId != null) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            {children}
        </div>
    );
};

export default AuthLayout;
