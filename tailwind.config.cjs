/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                latoRegular: "Lato-Regular",
                latoBold: "Lato-Bold",
            },
        },
    },
    plugins: [],
};
