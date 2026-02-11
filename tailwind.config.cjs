/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                pragati: ['"Pragati Narrow"', "sans-serif"],
                jacques: ['"Jacques Francois"', "serif"],
            },
        },
    },
    plugins: [],
}

