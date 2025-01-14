import { auth } from "@clerk/nextjs/server";

const TestPage = async () => {
    const { getToken } = await auth();

    const token = await getToken();
    console.log(token);

    return (
        <div className="container min-h-96 text-center">Testing stuff...</div>
    );
};

export default TestPage;
