import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
				'fade-in': 'fadeIn 0.3s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
				scaleIn: {
					'0%': { opacity: 0, transform: 'scale(0.95)' },
					'100%': { opacity: 1, transform: 'scale(1)' },
				},
			},
		},
	},
	plugins: [
		daisyui,
		require('tailwind-scrollbar-hide'),
	],

	daisyui: {
		themes: [
			"light",
			{
				black: {
					...daisyUIThemes["black"],
					primary: "rgb(29, 155, 240)",
					secondary: "rgb(24, 24, 24)",
				},
			},
		],
	},
};
