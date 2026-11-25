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

// `lectures` are the lecture decks of every lesson, in order.
// The home page lists the lessons, each with the one-sentence summary
// from course.yaml after its title. The links to a lesson's slides and to
// its Markdown files are on the lesson page, under its title.
export function homePage(course: Course, lessons: Lesson[], options: PageOptions): string {
  const rows = lessons.map((lesson) => {
    const summary = course.lessons.find((entry) => entry.id === lesson.id)?.summary ?? "";
    const link = `<a href="/lessons/${lesson.id}/">${escapeHtml(lesson.title)}</a>`;
    return `<li>${link}${summary ? `: <span class="lesson-summary">${escapeHtml(summary)}</span>` : ""}</li>`;
  });

  const body = `
    <h1>${escapeHtml(course.title)}</h1>
    <p class="description">${escapeHtml(course.description)}</p>
    <h2>Lessons</h2>
    <ol class="lesson-list">
      ${rows.join("\n")}
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
    ${lessonLinks(course, lesson)}
    ${lesson.html}${practice}`;

  return layout(`${lesson.title} | ${course.title}`, course, body, options);
}

// Small icons for the links under a lesson's title: a screen for slides,
// and angle brackets for a Markdown file.
const SLIDES_ICON =
  `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="8.5" rx="1"/>` +
  `<path d="M8 11v2.5M5 13.5h6"/></svg>`;
const SOURCE_ICON = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5"/></svg>`;

// The line of links under a lesson's title: its slides, and the Markdown
// files of the slides and of the page, for a teacher who wants to change
// them. The Markdown links need "source" in course.yaml.
function lessonLinks(course: Course, lesson: Lesson): string {
  const lectureIds = course.lessons.find((entry) => entry.id === lesson.id)?.lectureIds ?? [];
  const links: string[] = [];
  lectureIds.forEach((lectureId, index) => {
    // A lesson with several decks numbers them: Slides 1, Slides 2.
    const name = lectureIds.length === 1 ? "Slides" : `Slides ${index + 1}`;
    links.push(`<a href="/lectures/${lectureId}.html">${SLIDES_ICON}${name}</a>`);
    if (course.sourceUrl) {
      links.push(`<a href="${escapeHtml(course.sourceUrl)}/lectures/${lectureId}.md">${SOURCE_ICON}${name} source</a>`);
    }
  });
  if (course.sourceUrl) {
    links.push(`<a href="${escapeHtml(course.sourceUrl)}/lessons/${lesson.id}.md">${SOURCE_ICON}Page source</a>`);
  }
  return links.length === 0 ? "" : `<p class="lesson-links">${links.join("")}</p>`;
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
export const LIVE_RELOAD_SCRIPT = `<script>
    new EventSource("/__reload").onmessage = () => location.reload();
  </script>`;

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
