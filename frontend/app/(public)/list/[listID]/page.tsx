import { auth } from "@clerk/nextjs/server";

const listDetail = {
    name: "dat dep trai",
    id: "datdeptrai",
    owner: "user_2pZmSpCXopIsUW16NH9bEYddydU",
    isPrivate: false,
};

const ListDetailPage = async ({
    params,
}: {
    params: Promise<{ listID: string }>;
}) => {
    const { listID } = await params;
    const { userId } = await auth();

    if (listDetail.isPrivate && listDetail.owner !== userId) {
        return <div className="container">this is a private list</div>;
    }

    const editable = listDetail.owner === userId;

    return (
        <div className="container">
            thong tin cua {listID}
            {editable && <div>edit</div>}
        </div>
    );
};

export default ListDetailPage;
