"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface RatingContextProps {
    voteAverage: number;
    voteCount: number;
    setVoteAverage: (voteAverage: number) => void;
    setVoteCount: (voteCount: number) => void;
}

const RatingContext = createContext<RatingContextProps | undefined>(undefined);

export const RatingProvider = ({
    children,
    initialVoteAverage,
    initialVoteCount,
}: {
    children: ReactNode;
    initialVoteAverage: number;
    initialVoteCount: number;
}) => {
    const [voteAverage, setVoteAverage] = useState(initialVoteAverage);
    const [voteCount, setVoteCount] = useState(initialVoteCount);

    return (
        <RatingContext.Provider
            value={{ voteAverage, voteCount, setVoteAverage, setVoteCount }}
        >
            {children}
        </RatingContext.Provider>
    );
};

export const useRating = () => {
    const context = useContext(RatingContext);
    if (!context) {
        throw new Error(
            "useMovieRating must be used within a MovieRatingContext",
        );
    }

    return context;
};
