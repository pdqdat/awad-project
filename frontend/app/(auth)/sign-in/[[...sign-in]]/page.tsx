import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

import siteConfig from "@/config/site";

export const metadata: Metadata = {
    title: `Login | ${siteConfig.name}`,
    description: "Login to your MovieMate account",
};

const LoginPagePage = () => {
    return <SignIn/>;
};

export default LoginPagePage;
