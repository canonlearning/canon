// The HTML templates for the two kinds of page: the course home page and
// a lesson page.

import type { Course } from "../content/course.ts";
import type { Lesson } from "../content/lesson.ts";

export type PageOptions = {
  // In dev mode each page reloads itself when the site is rebuilt.
  liveReload: boolean;
};

export function homePage(course: Course, lessons: Lesson[], options: PageOptions): string {
  const links = lessons
    .map((lesson) => `<li><a href="/lessons/${lesson.id}/">${escapeHtml(lesson.title)}</a></li>`)
    .join("\n");

  const body = `
    <h1>${escapeHtml(course.title)}</h1>
    <p class="description">${escapeHtml(course.description)}</p>
    <ol class="lesson-list">
      ${links}
    </ol>`;

  return layout(course.title, course, body, options);
}

export function lessonPage(course: Course, lesson: Lesson, options: PageOptions): string {
  const body = `
    <h1>${escapeHtml(lesson.title)}</h1>
    ${lesson.html}`;

  return layout(`${lesson.title} | ${course.title}`, course, body, options);
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
