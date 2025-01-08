import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { tmdbImageBaseUrl } from "@/config/tmdb";

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

/**
 * Formats a given date string into a localized date string with the format "dd/mm/yyyy".
 *
 * @param date - The date string to format.
 * @returns The formatted date string in "dd/mm/yyyy" format.
 */
export const dateFormatter = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

/**
 * Formats a given string into a encoded string with spaces replaced by "+", for use in URL encoding.
 *
 * @param str - The string to encode
 * @returns The encoded string with spaces replaced by "+"
 */
export const customEncodeURIComponent = (str: string): string => {
    return encodeURIComponent(str).replace(/%2B/g, "+");
};

/**
 * Returns the full URL of a TMDB image based on the image size and image path.
 *
 * @param imageSize - The size of the image to fetch.
 * @param imagePath - The path of the image to fetch.
 * @returns The full URL of the TMDB image.
 */
export const getTmdbImageUrl = (
    imageSize: string = "w780",
    imagePath: string,
) => {
    return `${tmdbImageBaseUrl}/${imageSize}/${imagePath}`;
};

/**
 * Formats a runtime in minutes into a string with the format "h m".
 *
 * @param runtime - The runtime in minutes to format.
 * @returns The formatted runtime string.
 */
export const formatRuntime = (runtime: number) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    return `${hours}h ${minutes}m`;
};
