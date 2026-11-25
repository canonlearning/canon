// The Markdown steps shared by lessons and problems.
//
//   Markdown text
//     -> Markdown tree       (parseMarkdown)
//     -> custom syntax fixed (prepareTree)
//     -> HTML                (nodesToHtml)

import type { Root, RootContent } from "mdast";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export function parseMarkdown(markdown: string): Root {
  return unified()
    .use(remarkParse)
    .use(remarkGfm) // tables
    .use(remarkMath) // $...$ and $$...$$
    .use(remarkDirective) // ::visual{...}
    .parse(markdown);
}

// `markdown` is the text the tree was parsed from, and `file` names the
// file in error messages.
export function prepareTree(tree: Root, markdown: string, file: string): void {
  markDisplayMath(tree, markdown);
  replaceDirectives(tree, markdown, file);
}

// Turns a run of nodes from a prepared tree into HTML. Taking nodes and
// not a whole tree lets a problem be cut into its statement and steps.
export async function nodesToHtml(nodes: RootContent[]): Promise<string> {
  const toHtml = unified().use(remarkRehype).use(rehypeKatex).use(rehypeStringify);
  const htmlTree = await toHtml.run({ type: "root", children: nodes });
  return toHtml.stringify(htmlTree);
}

export function lineOf(file: string, node: { position?: { start: { line: number } } }): string {
  return `${file}:${node.position?.start.line ?? "?"}`;
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

// There is one piece of custom syntax so far: a line such as
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
        throw new Error(`${lineOf(file, node)}: ::visual needs a name, as in ::visual{name="..."}.`);
      }
      node.data = {
        hName: "div",
        hProperties: { className: ["visual-placeholder"], "data-visual": name },
      };
      node.children = [{ type: "text", value: `Visual: ${name}` }];
      return;
    }

    if (node.type === "leafDirective" || node.type === "containerDirective") {
      throw new Error(`${lineOf(file, node)}: "${node.name}" is not supported. Only ::visual is.`);
    }

    // The parser also reads a colon followed by a word, as in "a ratio of
    // a:b", as custom syntax. That is ordinary text, so it is put back.
    if (node.type === "textDirective" && parent && index !== undefined) {
      const original = markdown.slice(node.position?.start.offset, node.position?.end.offset);
      parent.children[index] = { type: "text", value: original };
    }
  });
}
