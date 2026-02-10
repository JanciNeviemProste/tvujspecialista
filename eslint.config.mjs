import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["backend/**", "__tests__/**", "node_modules/**"],
  },
];

export default eslintConfig;
