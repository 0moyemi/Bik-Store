import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import security from "eslint-plugin-security";
import noSecrets from "eslint-plugin-no-secrets";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      security,
      "no-secrets": noSecrets,
    },
    rules: {
      // Security rules - detect unsafe patterns
      "security/detect-unsafe-regex": "error",
      "security/detect-object-injection": "warn",
      "security/detect-eval-with-expression": "error",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "warn",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-pseudoRandomBytes": "warn",

      // Prevent accidental secrets in code
      "no-secrets/no-secrets": ["error", { "tolerance": 4.5 }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
