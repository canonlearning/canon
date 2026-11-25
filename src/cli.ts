// The command line entry point.
//
//   node cli.ts build [course-folder]   writes the site to <course>/dist
//   node cli.ts dev [course-folder]     serves it and rebuilds on change
//
// The course folder defaults to the current folder.

import path from "node:path";
import { buildSite } from "./site/build.ts";
import { startDevServer } from "./site/dev.ts";

const [command, courseFolder = "."] = process.argv.slice(2);
const courseDir = path.resolve(courseFolder);

try {
  if (command === "build") {
    const outDir = await buildSite(courseDir);
    console.log(`Built ${outDir}`);
  } else if (command === "dev") {
    await startDevServer(courseDir);
  } else {
    console.error("Usage: node cli.ts <build|dev> [course-folder]");
    process.exit(1);
  }
} catch (error) {
  console.error((error as Error).message);
  process.exit(1);
}
