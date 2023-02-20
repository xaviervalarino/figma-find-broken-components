import commonjs from "@rollup/plugin-commonjs";
import cssnano from "cssnano";
import html from "@rollup/plugin-html";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import svg from "rollup-plugin-svg";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

function reload() {
  return {
    writeBundle() {
      require("child_process").spawn("./scripts/reload-plugin.osascript", [], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });
    },
  };
}

const htmlTemplate = (bundle) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Find Broken Components</title>
  </head>
  <body>
    <script>${bundle[`bundle.js`].code}</script>
  </body>
</html>
`;

const renderConfig = {
  input: "src/main.ts",
  output: {
    format: "iife",
    name: "ui",
    file: "dist/bundle.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: !production,
        sourcemap: true,
      },
    }),
    resolve({
      browser: true,
      dedupe: (importee) => {
        return importee === "svelte" || importee.startsWith("svelte/");
      },
      extensions: [".svelte", ".mjs", ".js", ".json", ".ts", ".node"],
    }),
    commonjs({
      transformMixedEsModules: true,
    }),
    typescript(),
    svg(),
    postcss({
      extensions: [".css"],
      plugins: [cssnano()],
    }),
    html({
      fileName: "ui.html",
      template({ bundle }) {
        return htmlTemplate(bundle);
      },
    }),
    !production && reload(),
    production && terser(),
  ],
  watch: { clearScreen: false },
};

const mainThreadConfig = {
  input: "src/code.ts",
  output: {
    file: "dist/code.js",
    format: "cjs",
    name: "code",
    sourcemap: true,
  },
  plugins: [
    typescript(),
    commonjs(),
    resolve({
      browser: true,
    }),
    production && terser(),
  ],
};

export default [renderConfig, mainThreadConfig];
