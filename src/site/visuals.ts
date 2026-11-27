// Bundles a course's visuals into one script for the browser.
//
// Each file in <course>/visuals/ is one visual. The file crowd.ts must
// default-export a class that extends Visual, and it becomes the custom
// element <visual-crowd>, which the lesson line ::visual{name="crowd"}
// places on the page.

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const ENGINE_DIR = fileURLToPath(new URL("../..", import.meta.url));

// The names of the course's visuals: the file names in visuals/ without ".ts".
export function listVisuals(courseDir: string): string[] {
  const visualsDir = path.join(courseDir, "visuals");
  if (!existsSync(visualsDir)) return [];
  return readdirSync(visualsDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => file.slice(0, -".ts".length))
    .sort();
}

export async function bundleVisuals(
  courseDir: string,
  names: string[],
  outFile: string,
  options: { minify: boolean },
): Promise<void> {
  // The entry script imports each visual and registers its element.
  const entryScript = names
    .map(
      (name, index) =>
        `import Visual${index} from "./visuals/${name}.ts";\n` +
        `customElements.define("visual-${name}", Visual${index});`,
    )
    .join("\n");

  await build({
    stdin: { contents: entryScript, resolveDir: courseDir, loader: "ts" },
    outfile: outFile,
    bundle: true,
    format: "esm",
    minify: options.minify,
    logLevel: "silent",
    // A visual writes import ... from "canon". That name, and three.js,
    // are found from this folder, wherever the engine is installed.
    alias: { canon: path.join(ENGINE_DIR, "src/visual/index.ts") },
    nodePaths: [path.join(ENGINE_DIR, "node_modules")],
  });
}
