// Reads one lecture file and turns it into slides.
//
// A lecture is a slide deck written in the same Markdown as a lesson:
//
//   # The title of the lecture
//
//   ---
//
//   ## The first slide
//
//   A sentence, a formula, or a ::visual line.
//
//   > **Notes** What the teacher says here. Not shown to the room.
//
//   ---
//
//   ## The second slide
//
// The first line is the title, and it is the first slide. A line of ---
// starts a new slide. A "## Heading" that opens a slide is its headline,
// and is set in a bar along the top. A callout labeled "Notes" is the
// teacher's notes for its slide.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Blockquote, RootContent } from "mdast";
import { toString } from "mdast-util-to-string";
import { lineOf, nodesToHtml, parseMarkdown, prepareTree } from "./markdown.ts";

export type Lecture = {
  id: string;
  title: string;
  slides: Slide[];
  // The names of the visuals the lecture places with ::visual.
  visualNames: string[];
};

export type Slide = {
  // The headline along the top of the slide. Empty when it has none.
  headlineHtml: string;
  // Everything else the room sees.
  html: string;
  // The teacher's notes for the slide. Empty when it has none.
  notesHtml: string;
};

const NOTES_LABEL = "Notes";

export async function readLecture(courseDir: string, id: string): Promise<Lecture> {
  const file = path.join(courseDir, "lectures", `${id}.md`);
  if (!existsSync(file)) {
    throw new Error(`${file}: not found. course.yaml lists a lecture "${id}".`);
  }
  const lecture = await lectureMarkdownToSlides(readFileSync(file, "utf8"), file);
  return { id, ...lecture };
}

// `file` is used only to name the file in error messages.
export async function lectureMarkdownToSlides(
  markdown: string,
  file: string,
): Promise<{ title: string; slides: Slide[]; visualNames: string[] }> {
  const tree = parseMarkdown(markdown);
  const first = tree.children[0];
  if (first?.type !== "heading" || first.depth !== 1) {
    throw new Error(`${file}: a lecture must start with a "# Title" line.`);
  }
  const title = toString(first);
  const visualNames = prepareTree(tree, markdown, file);

  const slides: Slide[] = [];
  for (const nodes of splitAtRules(tree.children)) {
    if (nodes.length === 0) {
      throw new Error(`${file}: slide ${slides.length + 1} is empty. Remove one of the "---" lines around it.`);
    }
    const notes = nodes.filter(isNotes);
    const shown = nodes.filter((node) => !isNotes(node));
    if (shown.length === 0) {
      throw new Error(`${lineOf(file, nodes[0])}: this slide has notes and nothing to show.`);
    }
    const hasHeadline = shown[0].type === "heading" && shown[0].depth === 2;
    slides.push({
      headlineHtml: await nodesToHtml(hasHeadline ? [shown[0]] : []),
      html: await nodesToHtml(hasHeadline ? shown.slice(1) : shown),
      notesHtml: await nodesToHtml(notes.flatMap(withoutLabel)),
    });
  }
  return { title, slides, visualNames };
}

// Cuts a list of nodes into slides at each "---" line.
function splitAtRules(nodes: RootContent[]): RootContent[][] {
  const slides: RootContent[][] = [[]];
  for (const node of nodes) {
    if (node.type === "thematicBreak") slides.push([]);
    else slides[slides.length - 1].push(node);
  }
  return slides;
}

// The bold words at the start of a callout, or undefined if it has none.
function labelOf(node: RootContent) {
  if (node.type !== "blockquote") return undefined;
  const firstParagraph = node.children[0];
  if (firstParagraph?.type !== "paragraph") return undefined;
  const label = firstParagraph.children[0];
  return label?.type === "strong" ? label : undefined;
}

function isNotes(node: RootContent): node is Blockquote {
  const label = labelOf(node);
  return label !== undefined && toString(label).trim() === NOTES_LABEL;
}

// The contents of a notes callout, with the "Notes" label taken off.
function withoutLabel(notes: Blockquote): RootContent[] {
  const [firstParagraph, ...rest] = notes.children;
  if (firstParagraph.type !== "paragraph") return notes.children;
  return [{ ...firstParagraph, children: firstParagraph.children.slice(1) }, ...rest];
}
