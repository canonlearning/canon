import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import { readCourse } from "../src/content/course.ts";
import { buildSite } from "../src/site/build.ts";

const exampleCourse = path.resolve(import.meta.dirname, "../example");

// Builds a copy of the example course, so that dist/ is not written into
// this repository.
function copyOfExampleCourse(): string {
  const courseDir = mkdtempSync(path.join(tmpdir(), "canon-test-"));
  cpSync(exampleCourse, courseDir, { recursive: true });
  return courseDir;
}

test("building the example course writes the home page, lesson, quiz, and assets", async () => {
  const outDir = await buildSite(copyOfExampleCourse());

  const home = readFileSync(path.join(outDir, "index.html"), "utf8");
  expect(home).toContain('<a href="/lessons/first-lesson/">The first lesson</a>');
  expect(home).not.toContain("quiz");

  const lesson = readFileSync(path.join(outDir, "lessons/first-lesson/index.html"), "utf8");
  expect(lesson).toContain("<h1>The first lesson</h1>");
  expect(lesson).toContain("<h3>Two heads</h3>");
  expect(lesson.match(/<details>/g)).toHaveLength(1);
  expect(lesson).toContain("<summary>Solution</summary>");
  expect(lesson).toContain("<h4>Step 1: Count the outcomes</h4>");
  expect(lesson).toContain('<a href="/lessons/first-lesson/quiz/">');
  expect(lesson).not.toContain("EventSource");

  const quiz = readFileSync(path.join(outDir, "lessons/first-lesson/quiz/index.html"), "utf8");
  expect(quiz).toContain("<h1>The first lesson: practice quiz</h1>");
  expect(quiz).toContain("<h1>Answer key: The first lesson: practice quiz</h1>");
  // The questions come before the key, and the steps are only in the key.
  expect(quiz.indexOf("A fair coin")).toBeLessThan(quiz.indexOf("Answer key"));
  expect(quiz.indexOf("Count the outcomes")).toBeGreaterThan(quiz.indexOf("Answer key"));

  expect(existsSync(path.join(outDir, "assets/style.css"))).toBe(true);
  expect(existsSync(path.join(outDir, "assets/katex/katex.min.css"))).toBe(true);
  expect(existsSync(path.join(outDir, "assets/katex/fonts/KaTeX_Main-Regular.woff2"))).toBe(true);
});

test("the course's visuals are bundled into one script that the pages load", async () => {
  const outDir = await buildSite(copyOfExampleCourse());

  const script = readFileSync(path.join(outDir, "assets/visuals.js"), "utf8");
  expect(script).toContain('customElements.define("visual-example-visual"');

  const lesson = readFileSync(path.join(outDir, "lessons/first-lesson/index.html"), "utf8");
  expect(lesson).toContain('<script type="module" src="/assets/visuals.js"></script>');
});

test("a lesson that names a visual with no file is an error", async () => {
  const courseDir = copyOfExampleCourse();
  rmSync(path.join(courseDir, "visuals"), { recursive: true });

  await expect(buildSite(courseDir)).rejects.toThrow(
    'first-lesson.md: uses the visual "example-visual", but visuals/example-visual.ts does not exist.',
  );
});

test("a build to publish leaves the private quizzes out", async () => {
  const outDir = await buildSite(copyOfExampleCourse());

  expect(existsSync(path.join(outDir, "private"))).toBe(false);
  const home = readFileSync(path.join(outDir, "index.html"), "utf8");
  expect(home).not.toContain("Private quizzes");
  expect(home).not.toContain("Graded quiz");
});

test("a build with private quizzes writes them under private/", async () => {
  const outDir = await buildSite(copyOfExampleCourse(), { liveReload: false, includePrivate: true });

  const home = readFileSync(path.join(outDir, "index.html"), "utf8");
  expect(home).toContain('<a href="/private/quizzes/graded-quiz/">Graded quiz</a>');

  // A private quiz can hold a private problem and a public one.
  const quiz = readFileSync(path.join(outDir, "private/quizzes/graded-quiz/index.html"), "utf8");
  expect(quiz).toContain("flipped three times");
  expect(quiz).toContain("flipped twice");
  expect(quiz).toContain("Private quizzes are built only on this computer.");

  const practiceQuiz = readFileSync(path.join(outDir, "lessons/first-lesson/quiz/index.html"), "utf8");
  expect(practiceQuiz).toContain("This is a practice quiz.");
  expect(practiceQuiz).not.toContain("flipped three times");
});

test("the manifest lists the problems for each lesson and quiz", () => {
  const course = readCourse(exampleCourse);
  expect(course.lessons).toEqual([
    { id: "first-lesson", problemIds: ["coin-flips"], practiceQuizProblemIds: ["coin-flips"] },
  ]);
  expect(course.privateQuizzes).toEqual([
    { id: "graded-quiz", title: "Graded quiz", problemIds: ["secret-problem", "coin-flips"] },
  ]);
});

test("a folder without course.yaml is an error", () => {
  expect(() => readCourse(tmpdir())).toThrow("course.yaml: not found");
});
