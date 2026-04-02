/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                cream_yellow: "#DBCFB0",
            },
            fontFamily: {
                pragati: ['"Pragati Narrow"', "sans-serif"],
                jacques: ['"Jacques Francois"', "serif"],
                inter: ["Inter", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
}
