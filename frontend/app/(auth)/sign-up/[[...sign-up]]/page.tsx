import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

import siteConfig from "@/config/site";

export const metadata: Metadata = {
    title: `Register | ${siteConfig.name}`,
    description: "Register for a MovieMate account",
};

const RegisterPage = () => {
    return <SignUp />;
};

export default RegisterPage;
