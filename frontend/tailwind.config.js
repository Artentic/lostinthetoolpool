/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				void: {
					DEFAULT: '#08080c',
					50: '#0e0e14',
					100: '#12121a',
					200: '#181824',
					300: '#1e1e2e',
					400: '#2a2a3e',
					500: '#3a3a52',
				},
				ember: {
					DEFAULT: '#ff6b35',
					glow: '#ff6b3540',
					light: '#ff8f60',
					dark: '#cc5228',
					muted: '#ff6b3515',
				},
				steel: {
					DEFAULT: '#8a8a9a',
					light: '#b0b0c0',
					dark: '#5a5a6a',
					50: '#e8e8ee',
				},
				frost: {
					DEFAULT: '#4ecdc4',
					light: '#7eddd6',
					muted: '#4ecdc420',
				},
				milwaukee: '#db0032',
				dewalt: '#febd17',
				makita: '#00a4b3',
				ryobi: '#8dc73f',
				bosch: '#005daa',
				ego: '#00b140',
				// Keep old names as aliases for pages not yet updated
				charcoal: { DEFAULT: '#08080c', light: '#12121a', dark: '#08080c' },
				safety: { orange: '#ff6b35', 'orange-light': '#ff8f60' },
				electric: { blue: '#4ecdc4', 'blue-light': '#7eddd6' },
			},
			fontFamily: {
				display: ['Syne', 'sans-serif'],
				body: ['Plus Jakarta Sans', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
				heading: ['Syne', 'sans-serif'],
			},
			boxShadow: {
				'glow-sm': '0 0 20px rgba(255,107,53,0.15)',
				'glow': '0 0 40px rgba(255,107,53,0.2)',
				'glow-lg': '0 0 60px rgba(255,107,53,0.25)',
				'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.05)',
				'depth': '0 20px 60px rgba(0,0,0,0.5)',
			},
			animation: {
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
				'reveal': 'reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-12px) rotate(1deg)' },
				},
				pulseGlow: {
					'0%, 100%': { boxShadow: '0 0 20px rgba(255,107,53,0.15)' },
					'50%': { boxShadow: '0 0 40px rgba(255,107,53,0.3)' },
				},
				reveal: {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				slideUp: {
					from: { opacity: '0', transform: 'translateY(40px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
			},
		}
	},
	plugins: []
};
