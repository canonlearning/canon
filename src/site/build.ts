// Builds a course folder into a static site in <course>/dist:
//
//   dist/index.html                 the course home page
//   dist/lessons/<id>/index.html    one page per lesson
//   dist/assets/                    the stylesheet and the math fonts

import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readCourse } from "../content/course.ts";
import { readLesson } from "../content/lesson.ts";
import { homePage, lessonPage, type PageOptions } from "./page.ts";

export async function buildSite(
  courseDir: string,
  options: PageOptions = { liveReload: false },
): Promise<string> {
  const course = readCourse(courseDir);
  const lessons = await Promise.all(course.lessonIds.map((id) => readLesson(courseDir, id)));

  const outDir = path.join(courseDir, "dist");
  rmSync(outDir, { recursive: true, force: true });

  writePage(path.join(outDir, "index.html"), homePage(course, lessons, options));
  for (const lesson of lessons) {
    const file = path.join(outDir, "lessons", lesson.id, "index.html");
    writePage(file, lessonPage(course, lesson, options));
  }
  copyAssets(path.join(outDir, "assets"));

  return outDir;
}

function writePage(file: string, html: string): void {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html);
}

function copyAssets(assetsDir: string): void {
  mkdirSync(assetsDir, { recursive: true });

  const stylesheet = fileURLToPath(new URL("./style.css", import.meta.url));
  cpSync(stylesheet, path.join(assetsDir, "style.css"));

  // KaTeX typesets the math at build time. The browser still needs its
  // stylesheet and fonts. Only the .woff2 fonts are copied, because every
  // current browser uses those.
  const katexDir = path.dirname(fileURLToPath(import.meta.resolve("katex/dist/katex.min.css")));
  cpSync(path.join(katexDir, "katex.min.css"), path.join(assetsDir, "katex", "katex.min.css"));
  cpSync(path.join(katexDir, "fonts"), path.join(assetsDir, "katex", "fonts"), {
    recursive: true,
    filter: (source) => !path.extname(source) || source.endsWith(".woff2"),
  });
}
