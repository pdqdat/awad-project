import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
