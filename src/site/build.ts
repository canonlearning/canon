// Builds a course folder into a static site in <course>/dist:
//
//   dist/index.html                 the course home page
//   dist/lessons/<id>/index.html    one page per lesson
//   dist/lectures/<id>.html         one file per lecture deck
//   dist/assets/                    the stylesheet, the math fonts, and the
//                                   script that draws the visuals

import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readCourse } from "../content/course.ts";
import { readLecture } from "../content/lecture.ts";
import { readLesson, type Lesson } from "../content/lesson.ts";
import { readProblem, type Problem } from "../content/problem.ts";
import { deckPage } from "./deck.ts";
import { homePage, lessonPage, type PageOptions } from "./page.ts";
import { bundleVisuals, listVisuals } from "./visuals.ts";

export type BuildOptions = {
  // In dev mode each page reloads itself when the site is rebuilt.
  liveReload: boolean;
};

export async function buildSite(
  courseDir: string,
  buildOptions: BuildOptions = { liveReload: false },
): Promise<string> {
  const course = readCourse(courseDir);
  const lessons = await Promise.all(course.lessons.map((entry) => readLesson(courseDir, entry.id)));

  const lectureIds = course.lessons.flatMap((entry) => entry.lectureIds);
  const lectures = await Promise.all(lectureIds.map((id) => readLecture(courseDir, id)));

  const visualNames = listVisuals(courseDir);
  for (const lesson of lessons) {
    checkVisualsExist(path.join(courseDir, "lessons", `${lesson.id}.md`), lesson.visualNames, visualNames);
  }
  for (const lecture of lectures) {
    checkVisualsExist(path.join(courseDir, "lectures", `${lecture.id}.md`), lecture.visualNames, visualNames);
  }
  const options: PageOptions = {
    liveReload: buildOptions.liveReload,
    hasVisuals: visualNames.length > 0,
  };

  const outDir = path.join(courseDir, "dist");
  rmSync(outDir, { recursive: true, force: true });

  writePage(path.join(outDir, "index.html"), homePage(course, lessons, options));

  for (const [index, entry] of course.lessons.entries()) {
    const lesson = lessons[index];
    const problems = await readProblems(courseDir, entry.problemIds, visualNames);
    const html = lessonPage(course, lesson, problems, options);
    writePage(path.join(outDir, "lessons", entry.id, "index.html"), html);
  }

  copyAssets(path.join(outDir, "assets"));
  const visualsFile = path.join(outDir, "assets", "visuals.js");
  if (visualNames.length > 0) {
    // The dev server builds with liveReload, and leaves the script readable.
    const minify = !buildOptions.liveReload;
    await bundleVisuals(courseDir, visualNames, visualsFile, { minify });
  }

  // A deck holds its own copy of the visuals script, so it comes last.
  for (const lecture of lectures) {
    const html = deckPage(course, lecture, {
      liveReload: buildOptions.liveReload,
      visualsScript: lecture.visualNames.length > 0 ? readFileSync(visualsFile, "utf8") : undefined,
    });
    writePage(path.join(outDir, "lectures", `${lecture.id}.html`), html);
  }
  return outDir;
}

// `file` is the lesson or problem file that uses the visuals in `usedNames`.
function checkVisualsExist(file: string, usedNames: string[], visualNames: string[]): void {
  for (const name of usedNames) {
    if (!visualNames.includes(name)) {
      throw new Error(`${file}: uses the visual "${name}", but visuals/${name}.ts does not exist.`);
    }
  }
}

// Reads the problems for a list of ids, in the order of the list.
async function readProblems(courseDir: string, ids: string[], visualNames: string[]): Promise<Problem[]> {
  const problems = await Promise.all(ids.map((id) => readProblem(courseDir, id)));
  for (const problem of problems) {
    checkVisualsExist(`The problem "${problem.id}"`, problem.visualNames, visualNames);
  }
  return problems;
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
