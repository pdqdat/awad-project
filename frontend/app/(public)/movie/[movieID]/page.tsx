const MovieDetailPage = async ({
    params,
}: {
    params: Promise<{ movieID: string }>;
}) => {
    const { movieID } = await params;

    return (
        <div>
            This page displays the details of movie{" "}
            <span className="font-semibold text-primary">{movieID}</span>
        </div>
    );
};

export default MovieDetailPage;
