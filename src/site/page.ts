// The HTML templates for the three kinds of page: the course home page,
// a lesson page, and a quiz page.

import type { Course, QuizEntry } from "../content/course.ts";
import type { Lesson } from "../content/lesson.ts";
import type { Problem } from "../content/problem.ts";

export type PageOptions = {
  // In dev mode each page reloads itself when the site is rebuilt.
  liveReload: boolean;
  // Whether the course has visuals, and so a script for the pages to load.
  hasVisuals: boolean;
};

// `privateQuizzes` is empty in a build that will be published.
export function homePage(
  course: Course,
  lessons: Lesson[],
  privateQuizzes: QuizEntry[],
  options: PageOptions,
): string {
  const lessonLinks = lessons
    .map((lesson) => `<li><a href="/lessons/${lesson.id}/">${escapeHtml(lesson.title)}</a></li>`)
    .join("\n");

  const body = `
    <h1>${escapeHtml(course.title)}</h1>
    <p class="description">${escapeHtml(course.description)}</p>
    <h2>Lessons</h2>
    <ol class="link-list">
      ${lessonLinks}
    </ol>
    ${privateQuizList(privateQuizzes)}`;

  return layout(course.title, course, body, options);
}

const PRACTICE_NOTE =
  "This is a practice quiz. Its answer key is public, so it is for study and not for grading.";
const PRIVATE_NOTE =
  "Private quizzes are built only on this computer. They are not part of the published site.";

function privateQuizList(quizzes: QuizEntry[]): string {
  if (quizzes.length === 0) return "";
  const links = quizzes
    .map((quiz) => `<li><a href="/private/quizzes/${quiz.id}/">${escapeHtml(quiz.title)}</a></li>`)
    .join("\n");
  return `
    <h2>Private quizzes</h2>
    <p class="description">${PRIVATE_NOTE}</p>
    <ul class="link-list">
      ${links}
    </ul>`;
}

// `problems` are the practice problems for this lesson, in order. The
// lesson ends with them, and then with a link to its practice quiz.
export function lessonPage(
  course: Course,
  lesson: Lesson,
  problems: Problem[],
  hasPracticeQuiz: boolean,
  options: PageOptions,
): string {
  const problemList =
    problems.length === 0
      ? ""
      : `
      <p>Work each problem on paper before opening its solution.</p>
      ${problems.map(practiceProblem).join("\n")}`;

  const quizLink = hasPracticeQuiz
    ? `
      <p class="quiz-link">
        <a href="/lessons/${lesson.id}/quiz/">Print a practice quiz for this lesson</a>
      </p>`
    : "";

  const practice =
    problemList || quizLink
      ? `
    <section class="practice">
      <h2>Practice</h2>${problemList}${quizLink}
    </section>`
      : "";

  const body = `
    <h1>${escapeHtml(lesson.title)}</h1>
    ${lesson.html}${practice}`;

  return layout(`${lesson.title} | ${course.title}`, course, body, options);
}

// A practice problem shows its statement. The whole solution, with its
// steps and the answer, is in one box that stays closed until the reader
// opens it.
function practiceProblem(problem: Problem): string {
  return `
      <article class="problem">
        <h3>${escapeHtml(problem.title)}</h3>
        ${problem.statementHtml}
        <details>
          <summary>Solution</summary>
          ${problem.steps.map(solutionStep).join("")}
          <div class="answer"><strong>Answer:</strong> ${problem.answerHtml}</div>
        </details>
      </article>`;
}

// A quiz page is made to be printed. The questions come first, each with
// room to work. The answer key starts on a new sheet of paper.
export function quizPage(
  course: Course,
  title: string,
  problems: Problem[],
  kind: "practice" | "private",
  options: PageOptions,
): string {
  const questions = problems
    .map(
      (problem) => `
        <li class="quiz-question">
          ${problem.statementHtml}
          <div class="working-space"></div>
        </li>`,
    )
    .join("");

  const keyEntries = problems
    .map(
      (problem) => `
        <li class="key-entry">
          <div class="answer"><strong>Answer:</strong> ${problem.answerHtml}</div>
          ${problem.steps.map(solutionStep).join("")}
        </li>`,
    )
    .join("");

  const body = `
    <p class="print-note">
      ${kind === "practice" ? PRACTICE_NOTE : PRIVATE_NOTE}
      Print this page from the browser. The answer key prints on its own
      sheet, after the questions.
    </p>
    <section class="quiz">
      <h1>${escapeHtml(title)}</h1>
      <p class="quiz-name-line">Name: <span></span></p>
      <ol>${questions}
      </ol>
    </section>
    <section class="answer-key">
      <h1>Answer key: ${escapeHtml(title)}</h1>
      <ol>${keyEntries}
      </ol>
    </section>`;

  return layout(`${title} | ${course.title}`, course, body, options);
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
