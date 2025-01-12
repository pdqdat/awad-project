# MovieMind

A movie recommendation system that recommends movies based on the user's preferences.

## Features

-   User authentication: manual and social login

## Tech stack

-   Next.js
-   Tailwind CSS
-   Clerk
-   Express.js
-   MongoDB

## How to run

Clone the repository:

```bash
git clone https://github.com/pdqdat/awad-project.git
```

Configure the missing environment variables in the `backend/.env.development` file:

```backend/.env.development
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
