#!/usr/bin/env node
// The "canon" command of a course: canon dev, canon build.
//
// The engine is TypeScript that Node runs directly, with no compile step.
// Node refuses to do that for a package installed under node_modules,
// which is where a course's "npm install" puts the engine. So this file,
// which is plain JavaScript, tells Node how to load the engine's
// TypeScript files (esbuild removes the types) and then starts src/cli.ts.

import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import { transformSync } from "esbuild";

const engineUrl = new URL("../src/", import.meta.url).href;

registerHooks({
  load(url, context, nextLoad) {
    const isEngineFile = url.startsWith(engineUrl) && url.endsWith(".ts");
    if (!isEngineFile) return nextLoad(url, context);
    const typescript = readFileSync(fileURLToPath(url), "utf8");
    const javascript = transformSync(typescript, { loader: "ts" }).code;
    return { format: "module", source: javascript, shortCircuit: true };
  },
});

await import("../src/cli.ts");
