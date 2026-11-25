import path from "node:path";
import { expect, test } from "vitest";
import { lessonMarkdownToHtml, readLesson } from "../src/content/lesson.ts";

const exampleCourse = path.resolve(import.meta.dirname, "../example");

test("the first line of a lesson is its title, and is not repeated in the body", async () => {
  const lesson = await readLesson(exampleCourse, "first-lesson");
  expect(lesson.title).toBe("The first lesson");
  expect(lesson.html).not.toContain("<h1>");
});

test("$$...$$ is display math and $...$ is in-sentence math", async () => {
  const { html } = await lessonMarkdownToHtml("# T\n\nSo $x = 1$ and\n\n$$y = 2$$\n", "t.md");
  expect(html.match(/class="katex-display"/g)).toHaveLength(1);
  expect(html.match(/class="katex"/g)).toHaveLength(2);
});

test("a table and a blockquote become HTML", async () => {
  const lesson = await readLesson(exampleCourse, "first-lesson");
  expect(lesson.html).toContain("<table>");
  expect(lesson.html).toContain("<blockquote>");
});

test("::visual becomes a labeled placeholder", async () => {
  const lesson = await readLesson(exampleCourse, "first-lesson");
  expect(lesson.html).toContain('<div class="visual-placeholder" data-visual="example-visual">');
});

test("a colon followed by a word stays ordinary text", async () => {
  const lesson = await readLesson(exampleCourse, "first-lesson");
  expect(lesson.html).toContain("a ratio of a:b.");
});

test("a lesson without a title line is an error that names the file", async () => {
  await expect(lessonMarkdownToHtml("Just text.\n", "lessons/x.md")).rejects.toThrow(
    'lessons/x.md: a lesson must start with a "# Title" line.',
  );
});

test("unknown custom syntax is an error that names the file and line", async () => {
  const markdown = "# T\n\n:::opener\nText.\n:::\n";
  await expect(lessonMarkdownToHtml(markdown, "lessons/x.md")).rejects.toThrow(
    'lessons/x.md:3: "opener" is not supported. Only ::visual is.',
  );
});

test("::visual without a name is an error", async () => {
  await expect(lessonMarkdownToHtml("# T\n\n::visual\n", "lessons/x.md")).rejects.toThrow(
    "lessons/x.md:3: ::visual needs a name",
  );
});

test("a lesson listed in course.yaml but missing on disk is an error", async () => {
  await expect(readLesson(exampleCourse, "no-such-lesson")).rejects.toThrow(
    'not found. course.yaml lists a lesson "no-such-lesson".',
  );
});
