#!/usr/bin/env node

import fs from "fs";
import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

const args = process.argv.slice(2);

const reloadSandboxScript = (host) => `
// reload script
async function getCode() {
  const got = await fetch("${host}/code.js");
  const file = await got.text();
  console.clear()
  new Function("__html__", file)(__html__);
}
function onMessageWrapper(onmessageFn) {
  return (msg) => {
    if (onmessageFn) onmessageFn(msg);
    if (msg === "reload sandbox") {
      console.log("reloading sandbox");
      getCode(); }
  };
}
figma.ui.onmessage = onMessageWrapper(figma.ui.onmessage);
`;

function injectSandboxReload(filter) {
  return {
    name: "injectSandboxReload",
    setup(build) {
      build.onLoad({ filter }, async (args) => {
        const contents = await fs.promises.readFile(args.path, "utf8");
        const script = reloadSandboxScript("http://localhost:8000");
        return {
          contents: contents.concat(script),
          loader: "ts",
        };
      });
    },
  };
}

//make sure the directory exists
if (!fs.existsSync("./dist/")) {
  fs.mkdirSync("./dist/");
}

if (args.includes("--watch")) {
  let ctx = await esbuild.context({
    entryPoints: ["./src/code.ts", "./src/main.ts"],
    bundle: true,
    color: true,
    logLevel: "info",
    outdir: "./dist/",
    mainFields: ["svelte", "browser", "module", "main"],
    minify: false,
    sourcemap: "inline",
    loader: { ".svg": "text" },
    plugins: [
      esbuildSvelte({
        preprocess: sveltePreprocess(),
      }),
      injectSandboxReload(/code\.ts$/),
    ],
  });

  await ctx.watch();
  // TODO: update host when these promises resolve?
  const { host, port } = await ctx.serve({
    servedir: "./dist",
  });
}
