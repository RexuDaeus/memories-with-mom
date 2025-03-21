import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			cursive: ['var(--font-dancing-script)'],
  		},
      height: {
        '70': '18rem',
        '75': '19rem',
        '90': '22rem',
        '100': '25rem',
        '110': '28rem',
        '120': '30rem',
      },
      width: {
        '70': '18rem',
        '75': '19rem',
        '90': '22rem',
        '100': '25rem',
        '110': '28rem',
        '120': '30rem',
      },
  		colors: {
  			border: "hsl(var(--border))",
  			input: "hsl(var(--input))",
  			ring: "hsl(var(--ring))",
  			background: "hsl(var(--background))",
  			foreground: "hsl(var(--foreground))",
  			primary: {
  				DEFAULT: "hsl(var(--primary))",
  				foreground: "hsl(var(--primary-foreground))",
  			},
  			secondary: {
  				DEFAULT: "hsl(var(--secondary))",
  				foreground: "hsl(var(--secondary-foreground))",
  			},
  			destructive: {
  				DEFAULT: "hsl(var(--destructive))",
  				foreground: "hsl(var(--destructive-foreground))",
  			},
  			muted: {
  				DEFAULT: "hsl(var(--muted))",
  				foreground: "hsl(var(--muted-foreground))",
  			},
  			accent: {
  				DEFAULT: "hsl(var(--accent))",
  				foreground: "hsl(var(--accent-foreground))",
  			},
  			popover: {
  				DEFAULT: "hsl(var(--popover))",
  				foreground: "hsl(var(--popover-foreground))",
  			},
  			card: {
  				DEFAULT: "hsl(var(--card))",
  				foreground: "hsl(var(--card-foreground))",
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			"float-slow": "float 8s ease-in-out infinite",
  			"float-medium": "float 6s ease-in-out infinite",
  			"float-fast": "float 4s ease-in-out infinite",
  			"pulse": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  		},
  		keyframes: {
  			float: {
  				"0%, 100%": { transform: "translateY(0) scale(1)" },
  				"50%": { transform: "translateY(-20px) scale(1.05)" },
  			},
  			pulse: {
  				"0%, 100%": { opacity: "0.7" },
  				"50%": { opacity: "0.4" },
  			},
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
