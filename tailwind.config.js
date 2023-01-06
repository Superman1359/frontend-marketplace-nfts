/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            sans: ["Montserrat", "sans-serif"],
        },
        colors: {
            deepblue: "#312DCF",
            springgreen: "#C0F26A",
            white: "#FFFFFF",
            backgroundColor: "#F1F5F9",
            indigo: "#C7D2FE",
        },
        extend: {
            borderRadius: {
                36: "36px",
            },
            borderColor: {
                indigo: "#C7D2FE !important",
            },
            borderWidth: {
                2: "1px !important",
            },
            borderStyle: {
                solid: "solid !important",
            },
        },
    },
    plugins: [],
}
