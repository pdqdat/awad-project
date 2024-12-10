import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

import siteConfig from "@/config/site";

export const metadata: Metadata = {
    title: "Sign Up",
    description: `Create a new ${siteConfig.name} account`,
};

const RegisterPage = () => {
    return <SignUp />;
};

export default RegisterPage;
