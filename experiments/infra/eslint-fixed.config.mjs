// Fixed ESLint config for experiment measurement (Q5 + Q7).
// Used by analyze-run.sh when agent doesn't provide own config.
// Strict rules — production-grade TypeScript package expectations.
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.ts"],
    ignores: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // --- @typescript-eslint/recommended (baseline) ---
      ...tsPlugin.configs.recommended.rules,

      // --- Strict type safety ---
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": ["warn", {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/strict-boolean-expressions": "off", // needs type-checking, too slow

      // --- Code quality ---
      "complexity": ["warn", 10],
      "no-console": "warn",
      "no-duplicate-imports": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
      }],

      // --- Documentation ---
      // Note: eslint-plugin-jsdoc would need separate install.
      // For now we rely on Q8 judge for documentation quality.
    },
  },
];
