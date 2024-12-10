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
