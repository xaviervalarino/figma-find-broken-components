#!/usr/bin/env node

import fs from "fs";
import esbuild from "esbuild";
import path from "path";
import { cwd } from "process";

const args = process.argv.slice(2);

//make sure the directory exists
if (!fs.existsSync("./dist/")) {
  fs.mkdirSync("./dist/");
}

if (args.includes("--watch")) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const srcReloadFile = path.join(__dirname, "./assets/reload-main-thread.js");
  const destReloadFile = path.join(cwd(), "./dist/code.js");

  fs.copyFileSync(srcReloadFile, destReloadFile);

  let ctx = await esbuild.context({
    entryPoints: ["./src/code.ts"],
    bundle: true,
    color: true,
    logLevel: "info",
    outfile: "./dist/code.remote.js",
    mainFields: ["module", "main"],
    minify: false,
    platform: "node",
    sourcemap: "inline",
  });

  await ctx.watch();
  let { host, port } = await ctx.serve({
    servedir: "./dist",
  });
}
