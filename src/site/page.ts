// The HTML templates for the two kinds of page: the course home page and
// a lesson page.

import type { Course } from "../content/course.ts";
import type { Lesson } from "../content/lesson.ts";
import type { Problem } from "../content/problem.ts";

export type PageOptions = {
  // In dev mode each page reloads itself when the site is rebuilt.
  liveReload: boolean;
  // Whether the course has visuals, and so a script for the pages to load.
  hasVisuals: boolean;
};

export function homePage(course: Course, lessons: Lesson[], options: PageOptions): string {
  const lessonLinks = lessons
    .map((lesson) => `<li><a href="/lessons/${lesson.id}/">${escapeHtml(lesson.title)}</a></li>`)
    .join("\n");

  const body = `
    <h1>${escapeHtml(course.title)}</h1>
    <p class="description">${escapeHtml(course.description)}</p>
    <h2>Lessons</h2>
    <ol class="link-list">
      ${lessonLinks}
    </ol>`;

  return layout(course.title, course, body, options);
}

// `problems` are the practice problems for this lesson, in order. The
// lesson ends with them.
export function lessonPage(
  course: Course,
  lesson: Lesson,
  problems: Problem[],
  options: PageOptions,
): string {
  const practice =
    problems.length === 0
      ? ""
      : `
    <section class="practice">
      <h2>Practice</h2>
      <p>Work each problem on paper before opening its solution.</p>
      ${problems.map(practiceProblem).join("\n")}
    </section>`;

  const body = `
    <h1>${escapeHtml(lesson.title)}</h1>
    ${lesson.html}${practice}`;

  return layout(`${lesson.title} | ${course.title}`, course, body, options);
}

// A practice problem shows its statement. The whole solution, with its
// steps and the answer, is in one box that stays closed until the reader
// opens it.
function practiceProblem(problem: Problem, index: number): string {
  return `
      <article class="problem">
        <p class="problem-number">Problem ${index + 1}</p>
        <h3>${escapeHtml(problem.title)}</h3>
        ${problem.statementHtml}
        <details>
          <summary>Solution</summary>
          ${problem.steps.map(solutionStep).join("")}
          <div class="answer"><strong>Answer:</strong> ${problem.answerHtml}</div>
        </details>
      </article>`;
}

function solutionStep(step: { name: string; html: string }, index: number): string {
  return `
          <h4>Step ${index + 1}: ${escapeHtml(step.name)}</h4>
          ${step.html}`;
}

function layout(pageTitle: string, course: Course, body: string, options: PageOptions): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <link rel="stylesheet" href="/assets/katex/katex.min.css">
  <link rel="stylesheet" href="/assets/style.css">
  ${options.hasVisuals ? '<script type="module" src="/assets/visuals.js"></script>' : ""}
</head>
<body>
  <header class="site-header">
    <a href="/">${escapeHtml(course.title)}</a>
  </header>
  <main>${body}
  </main>
  ${options.liveReload ? LIVE_RELOAD_SCRIPT : ""}
</body>
</html>
`;
}

// The dev server sends a message on /__reload after each rebuild.
const LIVE_RELOAD_SCRIPT = `<script>
    new EventSource("/__reload").onmessage = () => location.reload();
  </script>`;

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
