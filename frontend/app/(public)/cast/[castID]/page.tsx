const CastDetailPage = async ({
    params,
}: {
    params: Promise<{ castID: string }>;
}) => {
    const { castID } = await params;

    return (
        <div>
            This page displays the details of cast{" "}
            <span className="font-semibold text-primary">{castID}</span>
        </div>
    );
};

export default CastDetailPage;
