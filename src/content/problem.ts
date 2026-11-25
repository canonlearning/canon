// Reads one problem file. A problem file looks like this:
//
//   ---
//   title: A flagged email
//   answer: 4/13
//   ---
//
//   The statement of the problem.
//
//   ## Solution
//
//   ### Name of the first step
//
//   The first step.
//
//   ### Name of the second step
//
//   The second step.
//
// Everything above "## Solution" is the statement. Each "###" heading
// under it starts a named step. Other keys in the top block (id, topic,
// difficulty) are allowed and are not used yet.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { RootContent } from "mdast";
import { toString } from "mdast-util-to-string";
import { parse as parseYaml } from "yaml";
import { lineOf, nodesToHtml, parseMarkdown, prepareTree } from "./markdown.ts";

export type Problem = {
  id: string;
  title: string;
  statementHtml: string;
  answerHtml: string;
  steps: SolutionStep[];
  // The names of the visuals the problem places with ::visual.
  visualNames: string[];
};

export type SolutionStep = {
  name: string;
  html: string;
};

// Public problems are in problems/. A private quiz may also use problems
// in private/problems/, which is looked in first when `includePrivate` is
// set.
export async function readProblem(
  courseDir: string,
  id: string,
  includePrivate = false,
): Promise<Problem> {
  const publicFile = path.join(courseDir, "problems", `${id}.md`);
  const privateFile = path.join(courseDir, "private", "problems", `${id}.md`);

  const file = includePrivate && existsSync(privateFile) ? privateFile : publicFile;
  if (!existsSync(file)) {
    throw new Error(`${file}: not found. A lesson or quiz lists a problem "${id}".`);
  }
  return problemTextToProblem(readFileSync(file, "utf8"), file, id);
}

// `file` is used only to name the file in error messages.
export async function problemTextToProblem(text: string, file: string, id: string): Promise<Problem> {
  const { header, markdown } = splitHeader(text, file);

  if (typeof header.title !== "string") {
    throw new Error(`${file}: needs a "title" in the block at the top.`);
  }
  if (header.answer === undefined || header.answer === null) {
    throw new Error(`${file}: needs an "answer" in the block at the top.`);
  }

  const tree = parseMarkdown(markdown);
  const visualNames = prepareTree(tree, markdown, file);
  const { statement, steps } = splitAtSolution(tree.children, file);

  return {
    id,
    title: header.title,
    statementHtml: await nodesToHtml(statement),
    answerHtml: await answerToHtml(String(header.answer), file),
    steps: await Promise.all(
      steps.map(async (step) => ({ name: step.name, html: await nodesToHtml(step.nodes) })),
    ),
    visualNames,
  };
}

// The block between the two "---" lines at the top is YAML. In the
// Markdown that is returned, the block is replaced by blank lines, so that
// line numbers in error messages still match the file.
function splitHeader(text: string, file: string): { header: Record<string, unknown>; markdown: string } {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!match) {
    throw new Error(`${file}: must start with a block between two "---" lines.`);
  }
  const header = parseYaml(match[1]) ?? {};
  const blankLines = "\n".repeat(match[0].split("\n").length - 1);
  return { header, markdown: blankLines + text.slice(match[0].length) };
}

type StepNodes = { name: string; nodes: RootContent[] };

function splitAtSolution(
  nodes: RootContent[],
  file: string,
): { statement: RootContent[]; steps: StepNodes[] } {
  const solutionIndex = nodes.findIndex(
    (node) => node.type === "heading" && node.depth === 2 && toString(node).trim() === "Solution",
  );
  if (solutionIndex === -1) {
    throw new Error(`${file}: needs a "## Solution" heading after the statement.`);
  }

  const steps: StepNodes[] = [];
  for (const node of nodes.slice(solutionIndex + 1)) {
    if (node.type === "heading" && node.depth === 3) {
      steps.push({ name: toString(node), nodes: [] });
    } else if (steps.length === 0) {
      throw new Error(
        `${lineOf(file, node)}: the solution must start with a "### step name" heading.`,
      );
    } else {
      steps[steps.length - 1].nodes.push(node);
    }
  }
  if (steps.length === 0) {
    throw new Error(`${file}: the solution needs at least one "### step name" heading.`);
  }

  return { statement: nodes.slice(0, solutionIndex), steps };
}

// The answer is a short piece of Markdown, so it can hold math.
async function answerToHtml(answer: string, file: string): Promise<string> {
  const tree = parseMarkdown(answer);
  prepareTree(tree, answer, file);
  return nodesToHtml(tree.children);
}
