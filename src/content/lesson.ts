// Reads one lesson file and turns it into a title and an HTML body.
//
// A lesson is plain Markdown with math. The data flow is:
//
//   Markdown text
//     -> Markdown tree       (parseMarkdown)
//     -> title taken out     (takeTitle)
//     -> custom syntax fixed (markDisplayMath, replaceDirectives)
//     -> HTML                (markdownTreeToHtml)

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Heading, Root } from "mdast";
import { toString } from "mdast-util-to-string";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type Lesson = {
  id: string;
  title: string;
  html: string;
};

export async function readLesson(courseDir: string, id: string): Promise<Lesson> {
  const file = path.join(courseDir, "lessons", `${id}.md`);
  if (!existsSync(file)) {
    throw new Error(`${file}: not found. course.yaml lists a lesson "${id}".`);
  }
  const { title, html } = await lessonMarkdownToHtml(readFileSync(file, "utf8"), file);
  return { id, title, html };
}

// `file` is used only to name the file in error messages.
export async function lessonMarkdownToHtml(
  markdown: string,
  file: string,
): Promise<{ title: string; html: string }> {
  const tree = parseMarkdown(markdown);
  const title = takeTitle(tree, file);
  markDisplayMath(tree, markdown);
  replaceDirectives(tree, markdown, file);
  const html = await markdownTreeToHtml(tree);
  return { title, html };
}

function parseMarkdown(markdown: string): Root {
  return unified()
    .use(remarkParse)
    .use(remarkGfm) // tables
    .use(remarkMath) // $...$ and $$...$$
    .use(remarkDirective) // ::visual{...}
    .parse(markdown);
}

// The title of a lesson is its first line, written as "# Title". It is
// removed from the tree because the page template prints it.
function takeTitle(tree: Root, file: string): string {
  const first = tree.children[0];
  if (first?.type !== "heading" || (first as Heading).depth !== 1) {
    throw new Error(`${file}: a lesson must start with a "# Title" line.`);
  }
  tree.children.shift();
  return toString(first);
}

// Math written as $$...$$ is shown centered on its own line, and math
// written as $...$ stays in the sentence. The Markdown parser treats
// $$...$$ on a single line as in-sentence math, so it is marked here.
function markDisplayMath(tree: Root, markdown: string): void {
  visit(tree, "inlineMath", (node) => {
    const start = node.position?.start.offset ?? 0;
    if (markdown.startsWith("$$", start)) {
      node.data = {
        ...node.data,
        hProperties: { className: ["language-math", "math-display"] },
      };
    }
  });
}

// Lessons have one piece of custom syntax so far: a line such as
//
//   ::visual{name="diagnostic-test-tree"}
//
// places an interactive visual. Visuals are not built yet, so the line
// becomes a labeled empty box.
function replaceDirectives(tree: Root, markdown: string, file: string): void {
  visit(tree, (node, index, parent) => {
    if (node.type === "leafDirective" && node.name === "visual") {
      const name = node.attributes?.name;
      if (!name) {
        throw new Error(`${where(file, node)}: ::visual needs a name, as in ::visual{name="..."}.`);
      }
      node.data = {
        hName: "div",
        hProperties: { className: ["visual-placeholder"], "data-visual": name },
      };
      node.children = [{ type: "text", value: `Visual: ${name}` }];
      return;
    }

    if (node.type === "leafDirective" || node.type === "containerDirective") {
      throw new Error(`${where(file, node)}: "${node.name}" is not supported. Only ::visual is.`);
    }

    // The parser also reads a colon followed by a word, as in "a ratio of
    // a:b", as custom syntax. That is ordinary text, so it is put back.
    if (node.type === "textDirective" && parent && index !== undefined) {
      const original = markdown.slice(node.position?.start.offset, node.position?.end.offset);
      parent.children[index] = { type: "text", value: original };
    }
  });
}

function where(file: string, node: { position?: { start: { line: number } } }): string {
  return `${file}:${node.position?.start.line ?? "?"}`;
}

async function markdownTreeToHtml(tree: Root): Promise<string> {
  const toHtml = unified().use(remarkRehype).use(rehypeKatex).use(rehypeStringify);
  const htmlTree = await toHtml.run(tree);
  return toHtml.stringify(htmlTree);
}
