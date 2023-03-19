#!/usr/bin/env node

import fs from "fs";
import esbuild from "esbuild";

const args = process.argv.slice(2);

// reload scripts
const reloadSandboxScript = `
async function getCode() {
  const got = await fetch("http://localhost:8000/code.js");
  const file = await got.text();
  // console.clear();
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

//make sure the directory exists
if (!fs.existsSync("./dist/")) {
  fs.mkdirSync("./dist/");
}

if (args.includes("--watch")) {
  let ctx = await esbuild.context({
    entryPoints: ["./src/code.ts"],
    bundle: true,
    color: true,
    logLevel: "info",
    outfile: "./dist/code.js",
    mainFields: ["module", "main"],
    minify: false,
    platform: "node",
    sourcemap: "inline",
    footer: { js: reloadSandboxScript },
  });

  await ctx.watch();
  await ctx.serve({
    servedir: "./dist",
  });
}
