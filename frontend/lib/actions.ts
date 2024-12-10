"use server";

import { Movie, MovieDetail } from "@/types";

export const fetchTrendingMovies = async (
    timeWindow: "week" | "day" = "week",
    page: number = 1,
): Promise<{
    results: Movie[];
    page: number;
    totalPages: number;
    totalResults: number;
}> => {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
    };

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/trending/movie/${timeWindow}?language=en-US&page=${page}`,
            options,
        );
        const data = await res.json();

        return {
            results: data.results as Movie[],
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
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
    };

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieID}?language=en-US`,
            options,
        );
        const data = await res.json();

        return data;
    } catch (error) {
        console.error("Error fetching movie detail: ", error);
        throw new Error("Error fetching movie detail");
    }
};
