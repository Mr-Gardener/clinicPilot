import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  js.configs.recommended, // base JS rules
  ...tseslint.configs.recommended, // TS plugin + parser combined for flat config
  prettierConfig, // disables ESLint rules that conflict with Prettier
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: globals.node,
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "off",
      "prettier/prettier": "error", // enforce Prettier formatting
    },
  },
]);
