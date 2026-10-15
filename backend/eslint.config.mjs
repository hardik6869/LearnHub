import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "*.mjs"] },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // No `any` — explicit, or leaking in from untyped values
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      // Template literals interpolate numbers throughout the existing messages
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      // Express error handlers must declare 4 params even when `next` is unused
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // Style rules that conflict with existing idioms (`return next(err)`, async handlers
      // passed to asyncHandler, escapes in existing validation regexes)
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/require-await": "off",
      "no-useless-escape": "off",
    },
  },
  // Must stay last: turns off rules that conflict with Prettier
  prettier,
);
