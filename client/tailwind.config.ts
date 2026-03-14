import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          forest: "#1B4332",
          sage: "#2D6A4F",
          mint: "#95D5B2",
          sand: "#D4A373",
          terracotta: "#E76F51",
          cream: "#FEFAE0",
          ivory: "#FEFCF3",
        },
        dark: {
          bg: "#0F1117",
          surface: "#1A1D2E",
          elevated: "#242736",
          border: "#2E3246",
          text: "#E8E8ED",
          muted: "#9CA3AF",
        },
        charcoal: "#212529",
        slate: "#495057",
        muted: "#6C757D",
        border: "#DEE2E6",
        surface: "#FFFFFF",
        status: {
          success: "#2D6A4F",
          warning: "#E9C46A",
          error: "#E63946",
          info: "#457B9D",
        },
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Space Grotesk", "monospace"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        display: ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "heading-1": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-2": ["1.875rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "heading-3": ["1.5rem", { lineHeight: "1.3" }],
        "heading-4": ["1.25rem", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        body: ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        caption: ["0.75rem", { lineHeight: "1.5" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
      },
      maxWidth: {
        content: "1280px",
        narrow: "960px",
        "prose-wide": "75ch",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 4px 6px -1px rgba(27, 67, 50, 0.06), 0 2px 4px -2px rgba(27, 67, 50, 0.05)",
        "card-hover": "0 10px 25px -5px rgba(27, 67, 50, 0.1), 0 8px 10px -6px rgba(27, 67, 50, 0.06)",
        elevated: "0 20px 40px -12px rgba(27, 67, 50, 0.12)",
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)",
        "glow-terracotta": "0 0 20px rgba(231, 111, 81, 0.3)",
        "glow-forest": "0 0 20px rgba(27, 67, 50, 0.3)",
      },
      backgroundImage: {
        "gradient-forest": "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
        "gradient-warm": "linear-gradient(135deg, #FEFAE0 0%, #FEFCF3 100%)",
        "gradient-sand": "linear-gradient(135deg, #D4A373 0%, #E9C46A 100%)",
        "gradient-hero": "radial-gradient(ellipse at top, #2D6A4F 0%, #1B4332 50%, #212529 100%)",
        "dot-pattern": "radial-gradient(circle, #DEE2E6 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-spacing": "24px 24px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "count-up": "countUp 1.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
