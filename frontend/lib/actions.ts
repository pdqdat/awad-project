"use server";

import { tmdbApiBaseUrl } from "@/config/tmdb";
import { Movie, MovieDetail, MovieSearchResult, CastDetail, PersonDetail } from "@/types";

const getRequestOptions = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
};

// export const fetchTrendingMovies = async (
//     timeWindow: "week" | "day" = "week",
//     page: number = 1,
// ): Promise<{
//     results: Movie[];
//     page: number;
//     totalPages: number;
//     totalResults: number;
// }> => {
//     try {
//         const res = await fetch(
//             `${tmdbApiBaseUrl}/trending/movie/${timeWindow}?language=en-US&page=${page}`,
//             getRequestOptions,
//         );
//         const data = await res.json();

//         return {
//             results: data.results,
//             page: data.page,
//             totalPages: data.total_pages,
//             totalResults: data.total_results,
//         };
//     } catch (error) {
//         console.error("Error fetching trending movies: ", error);
//         throw new Error("Error fetching trending movies");
//     }
// };

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
            // `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trending/${timeWindow}?page=${page}&limit=10`,
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

export const fetchPopularMovies = async (
    page: number = 1,
): Promise<{
    data: Movie[];
    page: number;
    totalPages: number;
    total: number;
}> => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/cate/popular?page=${page}&limit=10`,
            getRequestOptions,
        );
        const data = await res.json();

        return {
            data: data.data,
            page: data.page,
            totalPages: data.totalPages,
            total: data.total,
        };
    } catch (error) {
        console.error("Error fetching popular movies: ", error);
        throw new Error("Error fetching popular movies");
    }
};

export const fetchTopRatedMovies = async (
    page: number = 1,
): Promise<{
    data: Movie[];
    page: number;
    totalPages: number;
    total: number;
}> => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/cate/toprated?page=${page}&limit=10`,
            getRequestOptions,
        );
        const data = await res.json();

        return {
            data: data.data,
            page: data.page,
            totalPages: data.totalPages,
            total: data.total,
        };
    } catch (error) {
        console.error("Error fetching top rated movies: ", error);
        throw new Error("Error fetching top rated movies");
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

// export const fetchCastDetail = async (
//     castID: string,
// ): Promise<CastDetail> => {
//     try {
//         const res = await fetch(
//             `${tmdbApiBaseUrl}/person/${castID}?language=en-US`,
//             getRequestOptions,
//         );
//         const data = await res.json();

//         console.log(data);

//         return data;
//     } catch (error) {
//         console.error("Error fetching cast detail: ", error);
//         throw new Error("Error fetching cast detail");
//     }
// };

export const fetchPersonDetail = async (
    castID: string,
): Promise<PersonDetail> => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cast/${castID}`,
            // getRequestOptions,
            {method: "GET",}

        );
        const data = await res.json();

        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching cast detail: ", error);
        throw new Error("Error fetching cast detail");
    }
};