import Link from "next/link";

const ListsPage = () => {
    return (
        <div className="container">
            DP's ListsPage
            <div>
                <Link href="/list/datdeptrai">
                    go to 'datdeptrai' movie list
                </Link>
            </div>
        </div>
    );
};

export default ListsPage;
