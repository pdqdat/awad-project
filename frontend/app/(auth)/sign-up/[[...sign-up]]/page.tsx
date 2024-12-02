import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

import { appName } from "@/lib/const";

export const metadata: Metadata = {
    title: `Register | ${appName}`,
    description: "Register for a MovieMate account",
};

const RegisterPage = () => {
    return <SignUp />;
};

export default RegisterPage;
