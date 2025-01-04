// import { auth } from "@clerk/nextjs/server";
import { getAuthData } from "@lib/actions";

const TestPage = async () => {
    const authData = await getAuthData();

    return (
        <div className="container">
            <div className="mb-4 font-bold">Data from API:</div>
            <div>
                {authData
                    ? JSON.stringify(authData, null, 2)
                    : "error fetching auth data"}
            </div>
        </div>
    );
};

export default TestPage;
