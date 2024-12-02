import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

import { appName } from "@/lib/const";

export const metadata: Metadata = {
    title: `Login | ${appName}`,
    description: "Login to your MovieMate account",
};

const LoginPagePage = () => {
    return <SignIn/>;
};

export default LoginPagePage;
