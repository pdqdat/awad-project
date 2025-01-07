import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            aspectRatio: {
                "3/4": "3 / 4",
            },
            keyframes: {
                wiggle: {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
            },
            animation: {
                wiggle: "wiggle 1s ease-in-out infinite",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        plugin(function ({ addBase, addComponents }) {
            addBase({});
            addComponents({
                ".container": {
                    "@apply max-w-[77.5rem] mx-auto px-4 md:px-8 lg:px-10 xl:max-w-[87.5rem]":
                        {},
                },
                ".h1": {
                    "@apply scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl":
                        {},
                },
                ".h2": {
                    "@apply scroll-m-20 text-3xl font-bold tracking-tight first:mt-0":
                        {},
                },
                ".h3": {
                    "@apply scroll-m-20 text-2xl font-semibold tracking-tight":
                        {},
                },
                ".h4": {
                    "@apply scroll-m-20 text-xl font-semibold tracking-tight":
                        {},
                },
                ".h5": {
                    "@apply font-semibold text-lg leading-7": {},
                },
                ".h6": {
                    "@apply font-semibold text-base leading-7": {},
                },
                ".p": {
                    "@apply leading-7 [&:not(:first-child)]:mt-6": {},
                },
            });
        }),
    ],
};
export default config;
