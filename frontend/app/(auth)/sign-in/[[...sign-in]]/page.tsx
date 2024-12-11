import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

import siteConfig from "@/config/site";

export const metadata: Metadata = {
    title: "Sign In",
    description: `Sign in to your ${siteConfig.name} account`,
};

const LoginPagePage = () => {
    return <SignIn />;
};

export default LoginPagePage;
