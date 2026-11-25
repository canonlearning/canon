# Canon Learning

The engine behind canonlearning.ai: open courses with interactive visuals, an
in-class kit, and a problem bank, graded on paper. Built so far: static
pages for lessons with typeset math and interactive visuals, practice
problems with worked solutions, and lecture slide decks. Each deck is one
HTML file.

- The first course is the sibling repository `../probability-1`
  (`canonlearning/probability-1`). Course content goes there: lessons,
  problems, and visuals specific to that course. This repository holds the
  content parser, the site shell, the visual base class, and an example
  course.
- Order of work: write the first lesson and problem file by hand in
  `../probability-1`, then build the engine here to make them render.
- Code is MIT, here and in the course repository. Course content (lessons,
  problems, solutions) is CC BY 4.0. Do not change either without being
  asked.

## Running

- `npm test` and `npm run typecheck` in this repository.
- `npm run dev` in `../probability-1` serves the course at
  `http://localhost:4000` and rebuilds on save. `npm run build` writes the
  site to `dist/`. Both call `src/cli.ts` here by its sibling path. That is
  a shortcut for now; `docs/PLAN.md` ("How a course gets the engine") has
  what replaces it when the site goes online.
- Node runs the TypeScript directly, so there is no compile step. Imports end
  in `.ts`, and syntax that needs compiling (enums, parameter properties) is
  not used.

`src/content/` reads a course folder into data, and `src/site/` turns that
data into pages and lecture decks and bundles the course's visuals with
esbuild. `src/visual/`
runs in the browser: the base class, the figure frame, and the three.js stage
that a course's visuals import as `"canon"`. `example/` is a small course for
the tests.

- `npx tsc --noEmit -p ../probability-1` typechecks the course's visuals.
- Look at a visual in a browser before calling it done. The Playwright MCP
  server is set up for this repository; its output folder `.playwright-mcp/`
  is ignored by git.

## Documents

| File | Holds |
|---|---|
| `README.md` | The premise, the bet, who it is for, what a course contains, design principles, positioning, open model |
| `docs/MODEL.md` | The two layers (course and school LMS) and the funding in detail |
| `docs/PLAN.md` | First milestone, pilot scope, open questions, tech picks |
| `docs/VISUALS.md` | How visuals look and behave, and the gtcloudrobotics.com figures they are styled after |

Read `docs/PLAN.md` before writing code. A change to scope or to a tech pick
goes in the plan in the same change. Detail that does not belong in the
README goes in `docs/`, not in the bin.

## Code

This is a prototype codebase, and readability is valued over just about
everything else.

- Favor readable, direct code over industrial-grade machinery.
- Handle normal use, give clear errors, and document unsupported cases. Do
  not build compatibility layers or validation frameworks for hypothetical
  needs.
- Many iterations will happen. Do not protect an old architectural decision,
  or keep a diff small, to preserve an old design.
- Decide from first principles: pick what is objectively the cleaner way to
  read the code and follow the data flow.
- If the code is not simple enough for a junior engineer to follow, it will
  be refactored.

## What not to drift from

- The premise is subject-neutral. Probability 1 is the first course, not part
  of the argument, so keep it out of the premise and the design principles.
- There are two layers, and the line is whether the software needs to know
  who the student is. The course (lessons, visuals, problems) is a static site and never depends on anything else. Grades,
  student tracking, and rosters are the school layer: a separate,
  open, self-hostable LMS that a school plugs into its own systems. Do not
  put accounts or student data in the course layer, and do not gate course
  content behind the school layer.
- v1 is the course layer only: no server, no accounts, no LLM at runtime.
  The plan lists what is out of scope. The school layer waits on
  people using the course, so do not start it, scaffold it, or shape course
  code around it.
- Nothing is held back to sell. The funding model in `docs/MODEL.md`
  follows Protomaps: income is grants, commissioned work, the author's
  time, and help running the school layer, never access to the software or a
  course. Do not propose paywalls,
  instructor-only content, or features that make self-hosting harder.
- Visuals are styled like the lesson figures on gtcloudrobotics.com (the
  sibling repository `../gtcloudrobotics.com`). Read `docs/VISUALS.md` and
  that repository's figure harness before building one.
- A lesson is built around its visuals. Text says only what a visual cannot,
  and the paper tasks ask for work by hand (draw the tree, write out the
  sample space), not only a number. A lesson that reads as a textbook page
  with a figure added is wrong.
- Three picks are expensive to change later: the content format (Markdown +
  directives), the problem schema (one file per problem, one fixed version,
  named solution steps), and visuals as Web Components on one base class. Ask
  before changing any of them.
- The shell is timeboxed to about a week. Keep it thin; the content core is
  the platform.
- Lessons and problems are plain Markdown. Custom syntax has to earn its
  place: only `::visual` and the `:::details` drop-down exist. Do not add a
  directive for styling or for anything a heading, blockquote, or
  `course.yaml` entry can express.
- A teacher must be able to read and edit a lesson or problem file in a fork
  without knowing a framework. Numeric answers are stored exact.
- An LLM may draft a visual or a problem. A person verifies each one before
  it ships, and every problem and its solution is hand-checked.
- Everything published is public, solutions included, so the course
  publishes practice problems and no quizzes, and the engine builds none. A
  graded quiz is the teacher's own, written outside the course by changing
  the published problems. Do not add quiz pages or a private content folder.
- No problem variants, placeholders, or seeds in v1.

## Designing something new

These apply to anything with a look of its own that the engine does not
build yet (a deck, a handout, a new kind of page).

- Design it for its own use and its own reader. It does not take the
  lesson page's style, layout, text, or visuals unless that is asked for.
  The lesson is described here in the most detail, so it is the easiest
  thing to copy, and copying it is the usual mistake.
- Show the look before building it. Make two or three static mock-ups of
  a few representative pages, in a scratch file, and get a pick before
  changing the engine. Revise the picked mock-up until it is approved.
- It is not done until it has been used from start to finish in a browser
  and reviewed as a third party who has not seen the lesson: every page,
  every step, at the size it will be shown. Report what is rough, in order
  of how much it hurts, and not only what works.
- A check that nothing overflows and that the tests pass says it runs. It
  does not say it is good.

## Writing

- The README is mostly paragraphs. Lists are kept only where the items are
  parallel and each stands alone: the three things in the premise, the
  course contents table, and the design principles. Keep the author's
  wording where it exists; longer detail goes in `docs/MODEL.md`.
- Repository documents are impersonal: no "we", "I", or "you". "The author"
  where a person is needed.
- No dates, draft markers, or history. State what is true now, and say
  plainly what is not built.
- American spelling. Lists stay terse.
- No "e.g.," or "i.e.,", in documents or in lessons. An example goes in
  parentheses with nothing in front of it.
- Wrap Markdown prose at 80 columns. Tables, code blocks, and long URLs are
  exempt.

## Lesson writing

Lessons and worked solutions follow the plain, deductive style of the π0.5
paper (arXiv 2504.16054). Each statement follows from the ones before it,
complexity is added one step at a time, and nothing is written to sound
clever. The rules below are what that paper does, adapted for a student
reading the subject for the first time. They apply to course content, not to
the repository documents covered above.

Order:

- Open a lesson by saying plainly what its idea is, in a sentence or two,
  and then give the example that the lesson works through. Do not open with
  a puzzle, a question for the reader, or a "guess before going on" prompt.
- Open each later section with what is missing so far, so the next idea is
  needed. The paper's pattern is: what is true, what is missing ("however"),
  what is therefore required ("therefore"), then what is done.
- Give the whole before the parts. State the idea in one plain sentence, then
  the detail, then the refinement. Say how many parts there are before
  listing them ("in two stages: first ..., then ...").
- Add one new idea per section. Each section starts from where the last one
  ended and uses only what is already established.
- A section heading may be the question the section answers.

Reasons:

- State the cause in the sentence, with "because", "so", "since", or
  "therefore". A step with no stated reason is missing a sentence.
- Keep what is observed apart from what it means. Give the result, then the
  conclusion it supports ("this shows that ...").

Examples:

- Follow a general statement with a concrete case, in the same sentence where
  it fits, in parentheses. Do not write "e.g.," or "i.e.,": the parentheses
  are enough ("any experiment (rolling dice)").
- Reuse one running example through a lesson, so that only the idea changes
  from section to section.
- Use numbers, not adjectives: "1 person in 100", not "rare".

Terms and symbols:

- Define a term in the sentence where it first appears ("we call this set
  the sample space"), then use that one name every time. No synonyms for
  variety. Put the term in bold in that sentence, and nowhere else.
- Do not use a term before it is defined, and do not use jargon where an
  ordinary word says the same thing.
- Introduce each symbol in words beside the formula that first uses it
  ("where $B$ is the event that ..."). After a formula, say in a sentence
  what it states.
- A formula is part of the sentence around it and is punctuated that way.
- A calculation with more than one step is stacked, one step per line,
  aligned at the equals sign (`\begin{aligned}`). A formula that later text
  refers to gets a number (`\tag{1}`) and is cited as "(1)".
- A number that a figure shows in a color takes that color in the text and
  formulas: `$\red{9}$`. The colors are `\red`, `\blue`, `\teal`, and
  `\brass`, the palette of the visuals. Color a few numbers, not most.

Sentences:

- Write complete declarative sentences that mean exactly what they say. No
  metaphors, rhetorical questions, aphorisms, jokes, or one-line paragraphs
  for effect.
- Use plain verbs ("is", "has", "gives", "counts"), not "leverages",
  "utilizes", or "facilitates".
- Use the first person plural for the writer and reader working together
  ("we count the outcomes").
- State limits where they apply ("this holds only when $P(B) > 0$").
- A paragraph makes one point and states it in its first sentence.
- A figure caption says what each part or color is, then what the figure
  shows.

Where lessons depart from the paper, which is written for researchers:

- Keep sentences short: one or two clauses. The paper's long sentences, with
  several "which" clauses and parentheticals, are split.
- Leave out its field vocabulary, citations, and claims about novelty or
  importance.
- Do not rate the material: no "simply", "clearly", "obviously", "elegant",
  "powerful", or "it turns out".
- A blockquote is a callout, set off from the text by a thin rule. Bold words
  at its start are its label (`> **On paper** Draw the tree.`). It can hold
  a task to do on paper, a warning, or a side note. A callout holds real
  content; it is not there to make the text feel interactive.

## Lecture decks

A deck in a course's `lectures/` folder is the slides for teaching one
lesson. It is Markdown in the lesson format, and a line of `---` starts a
new slide. What is on a slide decides how it is laid out:

| Written on the slide | Shown as |
|---|---|
| `# Heading` | The title slide, or a slide that ends a part ("Part 1 is done") |
| `## Heading` first | The headline, one slim line along the top |
| A `::visual` line | A drawing that fills the slide and is stepped with the arrow keys |
| A bulleted list | Points that appear one per key press |
| A numbered list | The choices A, B, C, D of a question for a vote |
| A callout with a formula | A definition or rule, centered |
| `\begin{aligned}` formula | A calculation shown one line per key press |
| A sentence with no headline | A takeaway, set large |
| A callout labeled `**Notes**` | The teacher's notes, which the room does not see |

- A lesson has one deck. A lesson that takes more than one class has a
  slide that ends each part, not a deck for each class.
- A deck does not look like the reading page: it is white and sans-serif,
  with ordinary font weights and a slim headline. Do not make headlines
  heavy or tall.
- A deck is not the lesson cut into slides, in content or in looks. Do not
  copy the lesson's sentences, its formulas in sequence, its example, or
  its visuals. A deck uses different examples, so that the reading is a
  second pass over the same idea. It may point to the lesson ("this is (1)
  in the reading").
- A deck has its own drawings: flat SVG visuals with large type and few
  colors, made for a slide (`figure.flatBox` and `figure.steps`; see
  `docs/VISUALS.md`). Do not put a lesson's 3D visual on a slide.
- A deck goes further into each idea than the lesson and walks through it:
  every drawing and calculation is built up one key press at a time, and
  each step of a drawing has a one-line caption.
- A slide shows little prose, in type large enough for the back of a room.
  What the teacher says goes in the notes.
- Plain numbers in a list are plain text. Math is for symbols and
  formulas.
- Each idea runs in this order: the facts of the case, a vote, a task on
  paper, the drawing walked through, the calculation one line at a time,
  then the result in one sentence. A vote does not come before the room
  has the facts it is about.
- One result is not restated on more than two slides in a row.
- A task for the room is a callout labeled `**On paper**`. Its notes give
  the time to allow and the common wrong answer.
- The notes of a visual's slide say what each step shows, in order.
- The first slide's notes say which lesson the deck is for, what it uses in
  place of the lesson's example, and how the time is split.
- Real data on a slide is checked against its source, and the notes name
  the source.
- A slide that does not fit the screen has too much on it. Split it.
- A slide is read from the back of a room. In a flat drawing (1600 by 780
  units) no text is smaller than 30 units, and the drawing uses most of
  that space. Text and choices on a slide are about twice the size of the
  text on a lesson page.
- The slide shows nothing that is only for the teacher: no key hints, and
  no buttons that do nothing while the teacher is stepping.
- Before a deck is called done, walk it at 1280 by 720: every slide and
  every key press, forward and back (see "Designing something new").

## Commits

No `Co-Authored-By` trailer and no Claude attribution in commits or pull
requests.
