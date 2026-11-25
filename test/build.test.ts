import { cpSync, existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import { readCourse } from "../src/content/course.ts";
import { buildSite } from "../src/site/build.ts";

const exampleCourse = path.resolve(import.meta.dirname, "../example");

test("building the example course writes the home page, the lesson, and the assets", async () => {
  const courseDir = mkdtempSync(path.join(tmpdir(), "canon-test-"));
  cpSync(exampleCourse, courseDir, { recursive: true });

  const outDir = await buildSite(courseDir);

  const home = readFileSync(path.join(outDir, "index.html"), "utf8");
  expect(home).toContain('<a href="/lessons/first-lesson/">The first lesson</a>');

  const lesson = readFileSync(path.join(outDir, "lessons/first-lesson/index.html"), "utf8");
  expect(lesson).toContain("<h1>The first lesson</h1>");
  expect(lesson).not.toContain("EventSource");

  expect(existsSync(path.join(outDir, "assets/style.css"))).toBe(true);
  expect(existsSync(path.join(outDir, "assets/katex/katex.min.css"))).toBe(true);
  expect(existsSync(path.join(outDir, "assets/katex/fonts/KaTeX_Main-Regular.woff2"))).toBe(true);
});

test("a folder without course.yaml is an error", () => {
  expect(() => readCourse(tmpdir())).toThrow("course.yaml: not found");
});
