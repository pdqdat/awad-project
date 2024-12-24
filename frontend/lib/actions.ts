"use server";

import { tmdbApiBaseUrl } from "@/config/tmdb";
import { Movie, MovieDetail, MovieSearchResult } from "@/types";

const getRequestOptions = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
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
    includeAdult: boolean = false,
    page: number = 1,
): Promise<{
    results: MovieSearchResult[];
    page: number;
    totalPages: number;
    totalResults: number;
}> => {
    try {
        const res = await fetch(
            `${tmdbApiBaseUrl}/search/movie?query=${query}&include_adult=${includeAdult}&language=en-US&page=${page}`,
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
        console.error("Error searching movies: ", error);
        throw new Error("Error searching movies");
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
