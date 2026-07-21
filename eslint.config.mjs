import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

// Minimal flat config: base + TypeScript recommended + react-hooks (so hook
// lint + inline disable directives resolve). Kept off the full Next plugin
// preset, which currently conflicts with FlatCompat validation on ESLint 9.
export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "scratchpad_render/**", "video/**", "*.config.*"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "react-hooks": reactHooks },
    rules: { "react-hooks/rules-of-hooks": "error", "react-hooks/exhaustive-deps": "warn" },
    languageOptions: { globals: { window: "readonly", document: "readonly", requestAnimationFrame: "readonly", cancelAnimationFrame: "readonly", ResizeObserver: "readonly", console: "readonly", process: "readonly" } },
  },
);
