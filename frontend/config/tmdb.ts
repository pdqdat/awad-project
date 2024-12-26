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
    300: "w300",
    780: "w780",
    1280: "w1280",
    original: "original",
};

export const getTmdbImageUrl = (
    imageSize: string = "w780",
    imagePath: string,
) => {
    return `${tmdbImageBaseUrl}/${imageSize}/${imagePath}`;
};

export const genres = [
    {
        id: 28,
        name: "Action",
        value: "action",
    },
    {
        id: 12,
        name: "Adventure",
        value: "adventure",
    },
    {
        id: 16,
        name: "Animation",
        value: "animation",
    },
    {
        id: 35,
        name: "Comedy",
        value: "comedy",
    },
    {
        id: 80,
        name: "Crime",
        value: "crime",
    },
    {
        id: 99,
        name: "Documentary",
        value: "documentary",
    },
    {
        id: 18,
        name: "Drama",
        value: "drama",
    },
    {
        id: 10751,
        name: "Family",
        value: "family",
    },
    {
        id: 14,
        name: "Fantasy",
        value: "fantasy",
    },
    {
        id: 36,
        name: "History",
        value: "history",
    },
    {
        id: 27,
        name: "Horror",
        value: "horror",
    },
    {
        id: 10402,
        name: "Music",
        value: "music",
    },
    {
        id: 9648,
        name: "Mystery",
        value: "mystery",
    },
    {
        id: 10749,
        name: "Romance",
        value: "romance",
    },
    {
        id: 878,
        name: "Science Fiction",
        value: "science+fiction",
    },
    {
        id: 10770,
        name: "TV Movie",
        value: "tv+movie",
    },
    {
        id: 53,
        name: "Thriller",
        value: "thriller",
    },
    {
        id: 10752,
        name: "War",
        value: "war",
    },
    {
        id: 37,
        name: "Western",
        value: "western",
    },
];
