import type { Config } from "tailwindcss";

/**
 * Дизайн-токены «Стоя» — см. docs/06-ui-design.md.
 * Цвета заданы как RGB-триплеты в CSS-переменных (globals.css),
 * поэтому работают с opacity-модификаторами Tailwind (bg/60 и т.п.)
 * и мгновенно переключаются между темами.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        surface2: "rgb(var(--surface2) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        soft: "rgb(var(--soft) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accentInk: "rgb(var(--accent-ink) / <alpha-value>)",
        sage: "rgb(var(--sage) / <alpha-value>)",
        sageBg: "rgb(var(--sageBg) / <alpha-value>)",
        clay: "rgb(var(--clay) / <alpha-value>)",
        clayBg: "rgb(var(--clayBg) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgb(31 36 42 / 0.06)",
        lift: "0 8px 24px rgb(31 36 42 / 0.10)",
        fab: "0 10px 24px rgb(0 0 0 / 0.22)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        fadeUp: "fadeUp .3s cubic-bezier(.22,.61,.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
