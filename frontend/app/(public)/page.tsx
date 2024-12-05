import { SignInButton, SignUpButton } from "@clerk/nextjs";

import { Button } from "@ui/button";
import siteConfig from "@/config/site";

const HomePage = () => {
    return (
        <div className="w-full py-20 lg:py-32">
            {/* Hero section */}
            <div className="container">
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                    {/* App info */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            <h1 className="h1">{siteConfig.name}</h1>
                            <p className="p text-xl text-muted-foreground">
                                {siteConfig.description}
                            </p>
                        </div>
                        <div className="flex flex-row gap-4">
                            <SignInButton>
                                <Button size="lg" variant="outline">
                                    Sign in
                                </Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button size="lg" variant="ringHover">
                                    Create an account
                                </Button>
                            </SignUpButton>
                        </div>
                    </div>
                    {/* Image placeholders */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="aspect-square rounded-md bg-muted"></div>
                        <div className="row-span-2 rounded-md bg-muted"></div>
                        <div className="aspect-square rounded-md bg-muted"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
