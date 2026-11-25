// Reads one lesson file and turns it into a title and an HTML body.
//
// A lesson is plain Markdown with math. Its first line is its title,
// written as "# Title".

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Root } from "mdast";
import { toString } from "mdast-util-to-string";
import { nodesToHtml, parseMarkdown, prepareTree } from "./markdown.ts";

export type Lesson = {
  id: string;
  title: string;
  html: string;
  // The names of the visuals the lesson places with ::visual.
  visualNames: string[];
};

export async function readLesson(courseDir: string, id: string): Promise<Lesson> {
  const file = path.join(courseDir, "lessons", `${id}.md`);
  if (!existsSync(file)) {
    throw new Error(`${file}: not found. course.yaml lists a lesson "${id}".`);
  }
  const lesson = await lessonMarkdownToHtml(readFileSync(file, "utf8"), file);
  return { id, ...lesson };
}

// `file` is used only to name the file in error messages.
export async function lessonMarkdownToHtml(
  markdown: string,
  file: string,
): Promise<{ title: string; html: string; visualNames: string[] }> {
  const tree = parseMarkdown(markdown);
  const title = takeTitle(tree, file);
  const visualNames = prepareTree(tree, markdown, file);
  const html = await nodesToHtml(tree.children);
  return { title, html, visualNames };
}

// The title is removed from the tree because the page template prints it.
function takeTitle(tree: Root, file: string): string {
  const first = tree.children[0];
  if (first?.type !== "heading" || first.depth !== 1) {
    throw new Error(`${file}: a lesson must start with a "# Title" line.`);
  }
  tree.children.shift();
  return toString(first);
}
