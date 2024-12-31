"use server";

import { tmdbApiBaseUrl } from "@/config/tmdb";
import { Movie, MovieDetail, MovieSearchResult, CastDetail } from "@/types";

const getRequestOptions = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
};

const generateQueryParams = (
    query: string,
    page: number = 1,
    genres: string | string[] | undefined,
    minRating: string | undefined,
    maxRating: string | undefined,
    startDate: string | undefined,
    endDate: string | undefined,
) => {
    const params = new URLSearchParams({
        query: query,
        page: page.toString(),
    });

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

    return params;
};

export const fetchTrendingMovies = async (
    timeWindow: "week" | "day" = "week",
    page: number = 1,
): Promise<{
    results: Movie[];
    page: number;
    totalPages: number;
    totalResults: number;
}> => {
    try {
        const res = await fetch(
            `${tmdbApiBaseUrl}/trending/movie/${timeWindow}?language=en-US&page=${page}`,
            getRequestOptions,
        );
        const data = await res.json();

        return {
            results: data.results,
            page: data.page,
            totalPages: data.total_pages,
            totalResults: data.total_results,
        };
    } catch (error) {
        console.error("Error fetching trending movies: ", error);
        throw new Error("Error fetching trending movies");
    }
};

export const fetchMovieDetail = async (
    movieID: string,
): Promise<MovieDetail> => {
    try {
        const res = await fetch(
            `${tmdbApiBaseUrl}/movie/${movieID}?language=en-US`,
            getRequestOptions,
        );
        const data = await res.json();

        return data;
    } catch (error) {
        console.error("Error fetching movie detail: ", error);
        throw new Error("Error fetching movie detail");
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
        );

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?${params.toString()}`,
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
        console.error("Error searching movies: ", error);
        throw new Error("Error searching movies");
    }
};

export const fetchCastDetail = async (castID: string): Promise<CastDetail> => {
    try {
        const res = await fetch(
            `${tmdbApiBaseUrl}/person/${castID}?language=en-US`,
            getRequestOptions,
        );
        const data = await res.json();

        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching cast detail: ", error);
        throw new Error("Error fetching cast detail");
    }
};

export const fetchGenres = async (): Promise<{
    genres: { id: number; name: string }[];
}> => {
    try {
        const res = await fetch(
            `${tmdbApiBaseUrl}/genre/movie/list?language=en-US`,
            getRequestOptions,
        );
        const data = await res.json();

        return {
            genres: data.genres,
        };
    } catch (error) {
        console.error("Error fetching genres: ", error);
        throw new Error("Error fetching genres");
    }
};
