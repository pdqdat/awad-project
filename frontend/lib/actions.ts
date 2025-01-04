"use server";

import { auth } from "@clerk/nextjs/server";

import { Movie, MovieSearchResult, Cast } from "@/types";
import { LIMIT } from "@/config/movie";

// Request options for GET requests to the TMDB API
const getRequestOptions = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
};

const generateQueryParams = (
    query: string | undefined,
    page: number = 1,
    genres: string | string[] | undefined,
    minRating: string | undefined,
    maxRating: string | undefined,
    startDate: string | undefined,
    endDate: string | undefined,
    limit: number | undefined,
) => {
    const params = new URLSearchParams();

    // Append the query parameter if it exists
    if (query !== undefined) {
        params.append("query", query);
    }

    // Append the page parameter
    params.append("page", page.toString());

    // If genres is an array, append each genre to the URL
    // Else, append the single genre to the URL
    if (Array.isArray(genres)) {
        genres.forEach((genre) => params.append("genres", genre));
    } else if (genres !== undefined) {
        params.append("genres", genres);
    }
    // Append the rest of the query parameters if they exist
    if (minRating !== undefined) {
        params.append("minRating", minRating);
    }
    if (maxRating !== undefined) {
        params.append("maxRating", maxRating);
    }
    if (startDate !== undefined) {
        params.append("startDate", startDate);
    }
    if (endDate !== undefined) {
        params.append("endDate", endDate);
    }
    if (limit !== undefined) {
        params.append("limit", limit.toString());
    }

    return params;
};

export const fetchTrendingMovies = async (
    timeWindow: "week" | "day" = "week",
    page: number = 1,
): Promise<{
    data: Movie[];
    page: number;
    totalPages: number;
    total: number;
    limit: number;
}> => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trending/${timeWindow}?page=${page}&limit=${LIMIT}`,
            getRequestOptions,
        );
        const data = await res.json();

        return {
            data: data.data,
            page: data.page,
            totalPages: data.totalPages,
            total: data.total,
            limit: data.limit,
        };
    } catch (error) {
        console.error(
            `Error fetching ${timeWindow === "week" ? "weekly" : "daily"} trending movies`,
            error,
        );
        throw new Error(
            `Error fetching ${timeWindow === "week" ? "weekly" : "daily"} trending movies`,
        );
    }
};

export const fetchPopularMovies = async (
    page: number = 1,
    genres: string | string[] | undefined,
    minRating: string | undefined,
    maxRating: string | undefined,
    startDate: string | undefined,
    endDate: string | undefined,
): Promise<{
    data: Movie[];
    page: number;
    totalPages: number;
    total: number;
    limit: number;
}> => {
    try {
        const params = generateQueryParams(
            undefined,
            page,
            genres,
            minRating,
            maxRating,
            startDate,
            endDate,
            LIMIT,
        );

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/cate/popular?${params.toString()}`,
            { method: "GET" },
        );
        const data = await res.json();

        return {
            data: data.data,
            page: data.page,
            totalPages: data.totalPages,
            total: data.total,
            limit: data.limit,
        };
    } catch (error) {
        console.error("Error fetching popular movies: ", error);
        throw new Error("Error fetching popular movies");
    }
};

export const fetchTopRatedMovies = async (
    page: number = 1,
    genres: string | string[] | undefined,
    minRating: string | undefined,
    maxRating: string | undefined,
    startDate: string | undefined,
    endDate: string | undefined,
): Promise<{
    data: Movie[];
    page: number;
    totalPages: number;
    total: number;
    limit: number;
}> => {
    try {
        const params = generateQueryParams(
            undefined,
            page,
            genres,
            minRating,
            maxRating,
            startDate,
            endDate,
            LIMIT,
        );

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/cate/toprated?${params.toString()}`,
            { method: "GET" },
        );
        const data = await res.json();

        return {
            data: data.data,
            page: data.page,
            totalPages: data.totalPages,
            total: data.total,
            limit: data.limit,
        };
    } catch (error) {
        console.error("Error fetching top rated movies: ", error);
        throw new Error("Error fetching top rated movies");
    }
};

export const fetchMovieDetail = async (
    movieID: string,
): Promise<Movie | null> => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/${movieID}`,
            { method: "GET" },
        );
        if (!res.ok) {
            if (res.status === 404) {
                console.error("Movie not found");
                return null;
            }

            throw new Error("Error fetching movie detail");
        }

        const data = await res.json();

        return data;
    } catch (error) {
        console.error("Error fetching movie detail: ", error);
        throw new Error("Error fetching movie detail");
    }
};

export const fetchSimilarMovies = async (
    movieID: string,
): Promise<{
    data: Movie[];
}> => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/${movieID}/similar`,
            getRequestOptions,
        );
        const data = await res.json();

        return {
            data: data,
        };
    } catch (error) {
        console.error("Error fetching similar movies: ", error);
        throw new Error("Error fetching similar movies");
    }
};

export const searchMovies = async (
    query: string,
    page: number = 1,
    genres: string | string[] | undefined,
    minRating: string | undefined,
    maxRating: string | undefined,
    startDate: string | undefined,
    endDate: string | undefined,
): Promise<{
    data: MovieSearchResult[];
    page: number;
    totalPages: number;
    total: number;
    limit: number;
}> => {
    try {
        const params = generateQueryParams(
            query,
            page,
            genres,
            minRating,
            maxRating,
            startDate,
            endDate,
            undefined,
        );

        console.log(params.toString());
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?${params.toString()}`,
            { method: "GET" },
        );
        const data = await res.json();
        console.log(data.total);

        return {
            data: data.data,
            page: data.page,
            totalPages: data.totalPages,
            total: data.total,
            limit: data.limit,
        };
    } catch (error) {
        console.error("Error searching movies: ", error);
        throw new Error("Error searching movies");
    }
};

export const fetchCastDetail = async (castID: string): Promise<Cast | null> => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cast/${castID}`,
            { method: "GET" },
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Cast not found");
                return null;
            }

            throw new Error("Error fetching cast detail");
        }
        const data = await res.json();

        return data;
    } catch (error) {
        console.error("Error fetching cast detail: ", error);
        throw new Error("Error fetching cast detail");
    }
};

export const getAuthData = async () => {
    const { getToken } = await auth();

    const token = await getToken();
    console.log(token);

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/protected-endpoint`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                mode: "cors",
            },
        },
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
};

export const fetchLatestTrailers = async (): Promise<{
    data: Movie[];
} | null> => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/cate/upcoming`,
            { method: "GET" },
        );
        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error fetching trailers");
                return null;
            }

            throw new Error("Error fetching trailers");
        }

        const data = await res.json();

        return { data: data.data };
    } catch (error) {
        console.error("Error fetching trailer: ", error);
        throw new Error("Error fetching trailer");
    }
};
