import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    ignores: [
      "dist/**",
      ".next/**",
      "node_modules/**",
      "build/**",
      "canvasbag-deploy.zip",
      "frontend.zip",
      "deploy.zip",
      "api.zip",
      "tmp/**",
      "server.js",
      "api/**"
    ]
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
);
