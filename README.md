# MovieMind

A comprehensive movie platform that allows users to search, rate, review, and manage their favorite movies.

## Features

-   User authentication:
    -   Manual and social login
-   Movie search:
    -   Search for movies by title
    -   Search for movies by casts
    -   Filter search results by genre, rating, and release date
-   Movie details:
    -   View detailed information about a movie, including title, release date, rating, overview, genres, casts, trailer, and similar movies
-   Trending movies:
    -   View daily and weekly trending movies on the home page and the trending page
-   Popular movies:
    -   View popular movies on the home page and the popular page
-   Top rated movies:
    -   View top rated movies on the home page and the top rated page
-   Watchlist:
    -   Add and remove movies to the watchlist from the movie details page or from the movie card
    -   View and manage the watchlist
-   Favorites:
    -   Add and remove movies to the favorite list from the movie details page
    -   View and manage the list of favorite movies
-   Ratings:
    -   Rate movies from 1 to 10
    -   Edit and delete ratings
    -   View and manage the list of rated movies
-   Reviews:
    -   Write and delete reviews for movies
-   Movie recommendations:
    -   Get movie recommendations based on user's watchlist
-   AI chatbot:
    -   Ask AI to do simple tasks such as showing the casts of a movie, showing popular movies, showing user's profile, etc.
-   User profile:
    -   View and manage user's rated movies, watchlist, and favorite list
    -   View and edit user profile
    -   Change password
    -   Delete account

## Tech stack

-   Next.js
-   React
-   Tailwind CSS
-   Radix UI
-   Clerk
-   Express.js
-   MongoDB

## How to run

Clone the repository:

```bash
git clone https://github.com/pdqdat/awad-project.git
```

Create a `.env` file in the `backend` directory with the following content and configure the environment variables:

```backend/.env
MONGO_URI=
PORT=5000
CLERK_WEBHOOK_SECRET_KEY=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
GEMINI_API_KEY=
```

Configure the missing environment variables in the `frontend/.env.development` file:

```frontend/.env.development
CLERK_SECRET_KEY=
TMDB_ACCESS_TOKEN=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Install the dependencies, then run the Backend server:

```bash
cd backend
npm install
npm start
```

In another terminal, install the dependencies, then run the Frontend server:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can visit the deployed version at [https://moviemind.vercel.app/](https://moviemind.vercel.app/).
