import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.node,     // ✅ add Node.js globals (process, require, module)
        ...globals.browser   // keep browser globals if needed
      }
    }
  },
  pluginReact.configs.flat.recommended,
]);
