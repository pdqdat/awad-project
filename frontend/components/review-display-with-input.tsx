"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRouter } from "nextjs-toploader/app";
import { Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { fetchReviews, deleteReview, addReview } from "@lib/actions";
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from "@ui/card";
import { Textarea } from "@ui/textarea";
import { formatDate } from "@lib/utils";
import { Button } from "@ui/button";
import { Review } from "@/types";
import { Skeleton } from "@ui/skeleton";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@ui/form";

const reviewSchema = z.object({
    text: z
        .string()
        .min(1, {
            message: "Review must be at least 1 character",
        })
        .max(500, {
            message: "Review must be at most 500 characters",
        }),
});

const ReviewDisplayWithInput = ({
    movieID,
    compact = false,
}: {
    movieID: string;
    compact?: boolean;
}) => {
    // State to keep track of reviews
    const [reviews, setReviews] = useState<Review[]>([]);
    // State to keep track of loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            text: "",
        },
    });

    useEffect(() => {
        const fetchReviewsData = async () => {
            setIsLoading(true);

            const reviewsData = await fetchReviews(Number(movieID));
            if (!reviewsData) {
                setIsLoading(false);
                toast.error("Error fetching reviews", {
                    description: "Please try again later",
                });
                return;
            }

            setReviews(reviewsData);
            setIsLoading(false);
        };

        fetchReviewsData();
    }, [movieID]);

    const handleSubmission = async (values: z.infer<typeof reviewSchema>) => {
        // If user is not signed in, redirect to sign in page and notify user
        if (!isSignedIn || !isLoaded) {
            toast.info("Sign in to rate this movie");
            router.push(
                `/sign-in?redirect_url=${encodeURIComponent(window.location.toString())}`,
            );
            return;
        }

        setIsLoading(true);

        const res = await addReview(Number(movieID), values.text);

        if (res) {
            toast.success("Review added successfully");
            const updatedReviews = [...reviews, res.review];
            setReviews(updatedReviews);
            form.reset();
        } else {
            toast.error("Error adding review");
        }

        setIsLoading(false);
    };

    const handleDeleteReview = async (reviewId: string) => {
        setIsLoading(true);

        const response = await deleteReview(reviewId);

        if (response) {
            toast.success("Review deleted successfully");

            const updatedReviews = reviews.filter(
                (review) => review._id !== reviewId,
            );

            setReviews(updatedReviews);
        } else {
            toast.error("Error deleting review");
        }

        setIsLoading(false);
    };

    // Disable textarea & submit button if user is not signed in
    // or if reviews are being loaded
    const reviewSubmitDisabled = isLoading || !isSignedIn || !isLoaded;

    // Check if the review is authored by the current user
    const isAuthor = (review: Review) => review.userId === user?.id;

    const reviewToDisplay = compact ? reviews.slice(0, 3) : reviews;

    return (
        <>
            <div className="gap-4 lg:grid lg:grid-cols-12">
                <div className="col-span-4 mb-4 gap-4 lg:mb-0 xl:col-span-3">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmission)}
                            className="space-y-8"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {isSignedIn
                                            ? "Add a review"
                                            : "Sign in to add a review"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="text"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Review</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Write your review here"
                                                        className="max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-xl bg-muted text-base"
                                                        rows={3}
                                                        disabled={
                                                            reviewSubmitDisabled
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="ml-auto"
                                        disabled={reviewSubmitDisabled}
                                        type="submit"
                                    >
                                        Submit
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </Form>
                </div>
                <div className="col-span-8 xl:col-span-9">
                    {isLoading &&
                        Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="mb-2 h-52 w-full"
                            />
                        ))}
                    {reviews.length === 0 && !isLoading && (
                        <div>No reviews yet</div>
                    )}
                    {reviews.length !== 0 &&
                        !isLoading &&
                        reviewToDisplay.map((review) => (
                            <Card key={review._id} className="mb-4">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>
                                            {review.user.firstName}{" "}
                                            {review.user.lastName}
                                            {isAuthor(review) && (
                                                <span className="text-muted-foreground">
                                                    {" "}
                                                    (You)
                                                </span>
                                            )}
                                        </span>
                                        {isAuthor(review) && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDeleteReview(
                                                        review._id,
                                                    )
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        {formatDate(review.createdAt, true)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>{review.text}</CardContent>
                            </Card>
                        ))}
                </div>
            </div>
        </>
    );
};

export default ReviewDisplayWithInput;
