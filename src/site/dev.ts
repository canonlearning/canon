// The dev server: builds the course, serves dist/, and rebuilds and
// reloads the browser when a file in the course folder changes. It also
// builds the quizzes in the course's private/ folder, which the build
// command leaves out.

import { existsSync, readFileSync, statSync, watch } from "node:fs";
import { createServer, type ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build.ts";

const PORT = 4000;

const ENGINE_SITE_DIR = fileURLToPath(new URL(".", import.meta.url));
const ENGINE_VISUAL_DIR = fileURLToPath(new URL("../visual", import.meta.url));

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
};

export async function startDevServer(courseDir: string): Promise<void> {
  const outDir = path.join(courseDir, "dist");

  // Browser tabs that are waiting to be told to reload.
  const openPages = new Set<ServerResponse>();

  async function rebuild(): Promise<void> {
    try {
      await buildSite(courseDir, { liveReload: true, includePrivate: true });
      for (const page of openPages) page.write("data: reload\n\n");
    } catch (error) {
      // A mistake in a lesson file should not stop the server.
      console.error(`\n${(error as Error).message}\n`);
    }
  }

  await rebuild();

  let pendingRebuild: NodeJS.Timeout | undefined;
  const rebuildSoon = () => {
    // An editor can write a file in several steps, so wait a moment.
    clearTimeout(pendingRebuild);
    pendingRebuild = setTimeout(rebuild, 50);
  };
  watch(courseDir, { recursive: true }, (_event, changedFile) => {
    if (changedFile && !isIgnored(changedFile)) rebuildSoon();
  });
  // The engine's stylesheet and visual code are read fresh on each build,
  // so a change to them also shows up without a restart.
  watch(ENGINE_SITE_DIR, rebuildSoon);
  watch(ENGINE_VISUAL_DIR, rebuildSoon);

  const server = createServer((request, response) => {
    const urlPath = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);

    if (urlPath === "/__reload") {
      response.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
      openPages.add(response);
      request.on("close", () => openPages.delete(response));
      return;
    }

    const file = findFile(outDir, urlPath);
    if (!file) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end(`Not found: ${urlPath}`);
      return;
    }
    const contentType = CONTENT_TYPES[path.extname(file)] ?? "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(readFileSync(file));
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    const reason = error.code === "EADDRINUSE" ? `port ${PORT} is already in use` : error.message;
    console.error(`Could not start the dev server: ${reason}.`);
    process.exit(1);
  });

  server.listen(PORT, () => {
    console.log(`Serving ${courseDir} at http://localhost:${PORT}`);
  });
}

function isIgnored(changedFile: string): boolean {
  const topFolder = changedFile.split(path.sep)[0];
  return topFolder === "dist" || topFolder === ".git" || topFolder === "node_modules";
}

// Maps a URL path to a file in dist/. A path to a folder serves that
// folder's index.html. Returns undefined when there is no such file.
function findFile(outDir: string, urlPath: string): string | undefined {
  const file = path.join(outDir, urlPath);
  if (!file.startsWith(outDir) || !existsSync(file)) return undefined;
  if (statSync(file).isFile()) return file;

  const indexFile = path.join(file, "index.html");
  return existsSync(indexFile) ? indexFile : undefined;
}
