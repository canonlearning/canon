import path from "node:path";
import { expect, test } from "vitest";
import { problemTextToProblem, readProblem } from "../src/content/problem.ts";

const exampleCourse = path.resolve(import.meta.dirname, "../example");

test("a problem has a title, a statement, an answer, and named steps", async () => {
  const problem = await readProblem(exampleCourse, "coin-flips");
  expect(problem.title).toBe("Two heads");
  expect(problem.statementHtml).toContain("A fair coin is flipped twice.");
  expect(problem.statementHtml).not.toContain("equally likely");
  expect(problem.answerHtml).toContain('class="katex"');
  expect(problem.steps.map((step) => step.name)).toEqual([
    "Count the outcomes",
    "Count the outcomes with two heads",
  ]);
  expect(problem.steps[1].html).toContain('class="katex-display"');
});

test("a problem without a Solution heading is an error", async () => {
  const text = "---\ntitle: T\nanswer: 1\n---\n\nStatement.\n";
  await expect(problemTextToProblem(text, "problems/x.md", "x")).rejects.toThrow(
    'problems/x.md: needs a "## Solution" heading after the statement.',
  );
});

test("solution text before the first step is an error with the right line", async () => {
  const text = "---\ntitle: T\nanswer: 1\n---\n\nStatement.\n\n## Solution\n\nLoose text.\n";
  await expect(problemTextToProblem(text, "problems/x.md", "x")).rejects.toThrow(
    'problems/x.md:10: the solution must start with a "### step name" heading.',
  );
});

test("a problem without an answer is an error", async () => {
  const text = "---\ntitle: T\n---\n\nStatement.\n\n## Solution\n\n### Step\n\nText.\n";
  await expect(problemTextToProblem(text, "problems/x.md", "x")).rejects.toThrow(
    'problems/x.md: needs an "answer" in the block at the top.',
  );
});

test("a problem listed in course.yaml but missing on disk is an error", async () => {
  await expect(readProblem(exampleCourse, "no-such-problem")).rejects.toThrow(
    'not found. A lesson lists a problem "no-such-problem".',
  );
});
