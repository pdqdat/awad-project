export const tmdbApiBaseUrl = "https://api.themoviedb.org/3";

export const tmdbImageBaseUrl = "https://image.tmdb.org/t/p";

export const tmdbPosterSizes = {
    w92: "w92",
    w154: "w154",
    w185: "w185",
    w342: "w342",
    w500: "w500",
    w780: "w780",
    original: "original",
};

export const tmdbBackdropSizes = {
    w300: "w300",
    w780: "w780",
    w1280: "w1280",
    original: "original",
};

// Request options for GET requests to the TMDB API
export const tmdbGetRequestOptions = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
};
