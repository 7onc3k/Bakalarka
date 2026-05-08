import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  eslintConfigPrettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      complexity: ["warn", 10],
      "max-lines-per-function": ["warn", { max: 50 }],
    },
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "max-lines-per-function": "off",
    },
  },
  {
    ignores: [
      "dist/",
      "coverage/",
      ".stryker-tmp/",
      "stryker.config.js",
      ".opencode/",
    ],
  },
);
