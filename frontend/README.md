# Next.js Frontend for MovieMind

## Tech stack

- Next.js
- Tailwind CSS
- Radix UI
- Shadcn UI
- Clerk

## How to run

Configure the environment variables:

```.env.development
CLERK_SECRET_KEY=
TMDB_ACCESS_TOKEN=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```
