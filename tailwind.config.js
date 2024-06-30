/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
	safelist: [
		{
			pattern: /(bg|text|border|fill)-(white|red|green)/,
			variants: ['hover']
		},
	],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require("tailwindcss-animate")
  ],
}

