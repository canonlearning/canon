// Builds a course folder into a static site in <course>/dist:
//
//   dist/index.html                 the course home page
//   dist/lessons/<id>/index.html         one page per lesson
//   dist/lessons/<id>/quiz/index.html    the lesson's printable practice quiz
//   dist/assets/                    the stylesheet and the math fonts
//
// With `includePrivate`, the teacher's private quizzes are also built, to
// dist/private/quizzes/<id>/index.html. The dev server sets it. The build
// command does not, so a published site never holds a private quiz.

import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readCourse } from "../content/course.ts";
import { readLesson } from "../content/lesson.ts";
import { readProblem, type Problem } from "../content/problem.ts";
import { homePage, lessonPage, quizPage } from "./page.ts";

export type BuildOptions = {
  // In dev mode each page reloads itself when the site is rebuilt.
  liveReload: boolean;
  // Also build the quizzes in the course's private/ folder.
  includePrivate: boolean;
};

export async function buildSite(
  courseDir: string,
  options: BuildOptions = { liveReload: false, includePrivate: false },
): Promise<string> {
  const course = readCourse(courseDir);
  const lessons = await Promise.all(course.lessons.map((entry) => readLesson(courseDir, entry.id)));
  const privateQuizzes = options.includePrivate ? course.privateQuizzes : [];

  const outDir = path.join(courseDir, "dist");
  rmSync(outDir, { recursive: true, force: true });

  writePage(path.join(outDir, "index.html"), homePage(course, lessons, privateQuizzes, options));

  for (const [index, entry] of course.lessons.entries()) {
    const lesson = lessons[index];
    const lessonDir = path.join(outDir, "lessons", entry.id);
    const hasPracticeQuiz = entry.practiceQuizProblemIds.length > 0;

    const problems = await readProblems(courseDir, entry.problemIds, false);
    const html = lessonPage(course, lesson, problems, hasPracticeQuiz, options);
    writePage(path.join(lessonDir, "index.html"), html);

    if (hasPracticeQuiz) {
      const quizProblems = await readProblems(courseDir, entry.practiceQuizProblemIds, false);
      const title = `${lesson.title}: practice quiz`;
      const quizHtml = quizPage(course, title, quizProblems, "practice", options);
      writePage(path.join(lessonDir, "quiz", "index.html"), quizHtml);
    }
  }

  for (const quiz of privateQuizzes) {
    const problems = await readProblems(courseDir, quiz.problemIds, true);
    const html = quizPage(course, quiz.title, problems, "private", options);
    writePage(path.join(outDir, "private", "quizzes", quiz.id, "index.html"), html);
  }

  copyAssets(path.join(outDir, "assets"));
  return outDir;
}

// Reads the problems for a list of ids, in the order of the list. Only a
// private quiz may use the problems in private/problems/.
function readProblems(courseDir: string, ids: string[], includePrivate: boolean): Promise<Problem[]> {
  return Promise.all(ids.map((id) => readProblem(courseDir, id, includePrivate)));
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
