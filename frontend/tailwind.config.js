/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				charcoal: {
					DEFAULT: '#1a1a2e',
					light: '#252540',
					dark: '#111122'
				},
				safety: {
					orange: '#ff6b35',
					'orange-light': '#ff8a5c'
				},
				electric: {
					blue: '#4ecdc4',
					'blue-light': '#7eddd6'
				},
				milwaukee: '#db0032',
				dewalt: '#febd17',
				makita: '#00a4b3',
				ryobi: '#8dc73f',
				bosch: '#005daa',
				ego: '#00b140'
			},
			fontFamily: {
				heading: ['Barlow Condensed', 'sans-serif'],
				body: ['Inter', 'sans-serif']
			}
		}
	},
	plugins: []
};
