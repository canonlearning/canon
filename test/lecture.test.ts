import path from "node:path";
import { expect, test } from "vitest";
import { lectureMarkdownToSlides, readLecture } from "../src/content/lecture.ts";

const exampleCourse = path.resolve(import.meta.dirname, "../example");

test("a line of --- starts a new slide, and the title is on the first", async () => {
  const lecture = await readLecture(exampleCourse, "first-lecture");
  expect(lecture.title).toBe("The first lecture");
  expect(lecture.slides).toHaveLength(3);
  expect(lecture.slides[0].html).toContain("<h1>The first lecture</h1>");
  expect(lecture.slides[1].headlineHtml).toContain("<h2>A slide with a formula</h2>");
  expect(lecture.slides[1].html).not.toContain("<h2>");
  expect(lecture.slides[0].headlineHtml).toBe("");
  expect(lecture.visualNames).toEqual(["example-visual"]);
});

test("a callout labeled Notes is the teacher's notes, and other callouts are shown", async () => {
  const lecture = await readLecture(exampleCourse, "first-lecture");
  expect(lecture.slides[0].html).not.toContain("Said by the teacher");
  expect(lecture.slides[0].notesHtml).toContain("Said by the teacher");
  expect(lecture.slides[0].notesHtml).not.toContain("Notes");
  expect(lecture.slides[1].html).toContain("<strong>On paper</strong>");
  expect(lecture.slides[1].notesHtml).toBe("");
});

test("a lecture without a title is an error", async () => {
  await expect(lectureMarkdownToSlides("## No title\n", "deck.md")).rejects.toThrow(
    'deck.md: a lecture must start with a "# Title" line.',
  );
});

test("an empty slide is an error", async () => {
  await expect(lectureMarkdownToSlides("# T\n\n---\n\n---\n\n## Last\n", "deck.md")).rejects.toThrow(
    "deck.md: slide 2 is empty.",
  );
});

test("a lecture listed in course.yaml but missing on disk is an error", async () => {
  await expect(readLecture(exampleCourse, "no-such-lecture")).rejects.toThrow(
    'not found. course.yaml lists a lecture "no-such-lecture".',
  );
});
