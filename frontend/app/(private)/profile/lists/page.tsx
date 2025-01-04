import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@ui/button";

const ProfileListsPage = async () => {
    const user = await currentUser();

    return (
        <div className="container">
            {user?.fullName}&apos;s lists
            <div>
                <Button asChild>
                    <Link href="/list/datdeptrai">
                        Go to <strong>datdeptrai</strong> movie list
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default ProfileListsPage;
