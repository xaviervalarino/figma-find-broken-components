#!/usr/bin/env node

import fs from "fs";
import esbuild from "esbuild";

//make sure the directory exists
if (!fs.existsSync("./dist/")) {
  fs.mkdirSync("./dist/");
}

esbuild
  .build({
    entryPoints: ["./src/test.ts", "./src/code.ts"],
    bundle: true,
    outdir: "./dist",
    mainFields: ["module", "main"],
    minify: false,
    platform: "node",
    sourcemap: "inline",
  })
  .catch((error, location) => {
    console.warn("Errors: ", error, location);
    process.exit(1);
  });
