"use server";

import { auth } from "@clerk/nextjs/server";

import {
    Movie,
    MovieSearchResult,
    Cast,
    MovieInList,
    MovieInRatingList,
    Review,
} from "@/types";
import { LIMIT, CACHE_DURATION } from "@/config/movie";

// Request options for GET requests to the TMDB API
const tmdbGetRequestOptions = {
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
            tmdbGetRequestOptions,
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
            { method: "GET", cache: "no-store" },
        );
        if (!res.ok) {
            if (res.status === 404) {
                console.error("Movie not found");
                return null;
            }

            if (res.status === 500) {
                console.error("Internal server error");
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
} | null> => {
    const { userId, getToken } = await auth();

    try {
        let options;
        if (!userId) {
            options = { method: "GET" };
        } else {
            const token = await getToken();
            if (!token) {
                console.error("Error fetching session token");
                return null;
            }
            
            options = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/${movieID}/similar`,
            options,
        );
        if (!res.ok) {
            if (res.status === 404) {
                console.error("Similar movies not found");
                return null;
            }

            if (res.status === 401) {
                console.error("Unauthorized");
                return null;
            }

            throw new Error("Error fetching similar movies");
        }

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
} | null> => {
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

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?${params.toString()}`,
            { method: "GET" },
        );
        if (!res.ok) {
            console.log("Error searching movies");
            return null;
        }

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

export const fetchUpcomingMovies = async (): Promise<{
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

export const addToWatchlist = async (
    movieID: number,
): Promise<{
    status: number;
    message: string;
    watchlist: MovieInList[];
} | null> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/watchlist`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId: movieID }),
            },
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error adding to watchlist");
                return null;
            }
            if (res.status === 401) {
                console.error("Unauthorized");
                return null;
            }

            throw new Error("Error adding to watchlist");
        }

        const data = await res.json();

        return {
            status: res.status,
            message: data.message,
            watchlist: data.watchlist,
        };
    } catch (error) {
        console.error("Error adding to watchlist: ", error);
        throw new Error("Error adding to watchlist");
    }
};

export const removeFromWatchlist = async (
    movieID: number,
): Promise<{
    status: number;
    message: string;
    watchlist: MovieInList[];
} | null> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/watchlist`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId: movieID }),
            },
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error removing from watchlist");
                return null;
            }
            if (res.status === 401) {
                console.error("Unauthorized");
                return null;
            }

            throw new Error("Error removing from watchlist");
        }

        const data = await res.json();

        return {
            status: res.status,
            message: data.message,
            watchlist: data.watchlist,
        };
    } catch (error) {
        console.error("Error removing from watchlist: ", error);
        throw new Error("Error removing from watchlist");
    }
};

export const fetchWatchlist = async (): Promise<MovieInList[] | null> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const options: RequestInit = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            // Cache the response
            // The default cache duration is 3 seconds
            next: {
                revalidate: CACHE_DURATION,
            },
        };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/watchlist`,
            options,
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error fetching watchlist");
                return null;
            }

            throw new Error("Error fetching watchlist");
        }

        const data = await res.json();

        return data.watchlist;
    } catch (error) {
        console.error("Error fetching watchlist: ", error);
        throw new Error("Error fetching watchlist");
    }
};

export const addToFavorite = async (
    movieID: number,
): Promise<{
    status: number;
    message: string;
    favorite: MovieInList[];
} | null> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorite`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId: movieID }),
            },
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error adding to favorite");
                return null;
            }
            if (res.status === 401) {
                console.error("Unauthorized");
                return null;
            }

            throw new Error("Error adding to favorite");
        }

        const data = await res.json();

        return {
            status: res.status,
            message: data.message,
            favorite: data.favoriteList,
        };
    } catch (error) {
        console.error("Error adding to favorite: ", error);
        throw new Error("Error adding to favorite");
    }
};

export const removeFromFavorite = async (
    movieID: number,
): Promise<{
    status: number;
    message: string;
    favorite: MovieInList[];
} | null> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorite`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId: movieID }),
            },
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error removing from favorite");
                return null;
            }
            if (res.status === 401) {
                console.error("Unauthorized");
                return null;
            }

            throw new Error("Error removing from watchlist");
        }

        const data = await res.json();

        return {
            status: res.status,
            message: data.message,
            favorite: data.favoriteList,
        };
    } catch (error) {
        console.error("Error removing from favorite: ", error);
        throw new Error("Error removing from favorite");
    }
};

export const fetchFavorite = async (): Promise<MovieInList[] | null> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const options: RequestInit = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: {
                revalidate: CACHE_DURATION,
            },
        };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorite`,
            options,
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error fetching favorite");
                return null;
            }

            throw new Error("Error fetching favorite");
        }

        const data = await res.json();

        return data.favoriteList;
    } catch (error) {
        console.error("Error fetching favorite: ", error);
        throw new Error("Error fetching favorite");
    }
};

export const rateMovie = async (
    movieID: number,
    rating: number,
): Promise<{
    status: number;
    message: string;
    movie: {
        tmdb_id: number;
        vote_average: number;
        vote_count: number;
    };
} | null> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    movieId: movieID,
                    rating: rating,
                }),
            },
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error rating movie");
                return null;
            }
            if (res.status === 401) {
                console.error("Unauthorized");
                return null;
            }

            throw new Error("Error rating movie");
        }

        const data = await res.json();

        return {
            status: res.status,
            message: data.message,
            movie: data.movie,
        };
    } catch (error) {
        console.error("Error rating movie: ", error);
        throw new Error("Error rating movie");
    }
};

export const removeRating = async (
    movieID: number,
): Promise<{
    status: number;
    message: string;
    movie: {
        tmdb_id: number;
        vote_average: number;
        vote_count: number;
    };
} | null> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rate`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId: movieID }),
            },
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error removing rating");
                return null;
            }
            if (res.status === 401) {
                console.error("Unauthorized");
                return null;
            }

            throw new Error("Error removing rating");
        }

        const data = await res.json();

        return {
            status: res.status,
            message: data.message,
            movie: data.movie,
        };
    } catch (error) {
        console.error("Error removing rating: ", error);
        throw new Error("Error removing rating");
    }
};

export const fetchRatingList = async (): Promise<
    MovieInRatingList[] | null
> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const options: RequestInit = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: {
                revalidate: CACHE_DURATION,
            },
        };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rate`,
            options,
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error fetching rating list");
                return null;
            }

            throw new Error("Error fetching rating list");
        }

        const data = await res.json();

        return data.ratingList;
    } catch (error) {
        console.error("Error fetching rating list: ", error);
        throw new Error("Error fetching rating list");
    }
};

export const fetchReviews = async (
    movieID: number,
): Promise<Review[] | null> => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies/${movieID}/reviews`,
            { method: "GET" },
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error fetching reviews");
                return null;
            }
            throw new Error("Error fetching reviews");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching reviews: ", error);
        throw new Error("Error fetching reviews");
    }
};

export const addReview = async (
    movieID: number,
    review: string,
): Promise<{ message: string; review: Review } | null> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: review, movieId: movieID }),
            },
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error adding review");
                return null;
            }
            if (res.status === 401) {
                console.error("Unauthorized");
                return null;
            }

            throw new Error("Error adding review");
        }

        const data = await res.json();

        return {
            message: data.message,
            review: data.review,
        };
    } catch (error) {
        console.error("Error adding review: ", error);
        throw new Error("Error adding review");
    }
};

export const deleteReview = async (
    reviewID: string,
): Promise<{ status: number; message: string } | null> => {
    const { getToken } = await auth();

    try {
        const token = await getToken();
        if (!token) {
            console.error("Error fetching session token");
            return null;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${reviewID}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!res.ok) {
            if (res.status === 404) {
                console.error("Error removing rating");
                return null;
            }
            if (res.status === 401) {
                console.error("Unauthorized");
                return null;
            }

            throw new Error("Error removing rating");
        }

        const data = await res.json();

        return {
            status: res.status,
            message: data.message,
        };
    } catch (error) {
        console.error("Error deleting review: ", error);
        throw new Error("Error deleting review");
    }
};
