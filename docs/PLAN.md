# Plan

The pilot scope, then the tech picks. The premise and design principles are in
the [README](../README.md), and the two layers and funding are in the
[model](MODEL.md).

## First milestone

One thin slice, which is also the definition of done for the shell timebox:

1. One lesson (conditional probability) with the experiment simulation as its
   visual.
2. One Bayes' rule problem with a three-step solution.
3. One printed quiz with an answer key.

This is a textbook page with a better visual, plus a quiz to print. The
in-class kit is not part of it.

Order of work: start in the course repo. Write the first lesson and problem
file by hand in the intended format, then build the engine to make them
render.

## Pilot scope (v1)

v1 is the course layer only: a fully static site with no server, no LLM at
runtime, and no accounts. It serves the first two audiences in the README
(students finding it, teachers adopting it). The school layer is not started
until both show real use; the picks for it below are notes, not a schedule.

It is the first two-week unit of Probability 1, a first university course in
probability.

### Why college first

- The author teaches at a university now, so the first classroom is at hand.
- College professors have far more freedom in how they teach than high school
  teachers do, so a new product or a new way of teaching is an easier sell.

### Why Probability 1 first

- The author knows the subject well and has taken the course.
- The learning objectives are close to standard from one university to the
  next, so a course built well once fits most syllabi with small edits.
- The author may ask to teach it at Georgia Tech, and a whole course laid out
  makes that an easier ask. So the full outline below matters, not only the
  pilot unit.
- A course such as an introduction to robotics is too niche to show first. It
  varies by school and reaches fewer students and teachers.

### What Probability 1 covers (draft, to be corrected)

| Unit | Topics |
|---|---|
| Foundations (the pilot) | Sample spaces, events, the axioms, counting, conditional probability, Bayes' rule, independence |
| Discrete random variables | PMFs, expectation, variance, Bernoulli, binomial, geometric, Poisson |
| Continuous random variables | PDFs and CDFs, uniform, exponential, normal |
| Several random variables | Joint and conditional distributions, covariance, sums |
| Limits | Law of large numbers, central limit theorem |

### Pilot lesson sequence (draft, to be corrected)

1. Experiments, outcomes, and events: the sample space.
2. The axioms, and what follows from them: complements, unions, inclusion-exclusion.
3. Counting equally likely outcomes: permutations and combinations.
4. Conditional probability and the multiplication rule: tree diagrams.
5. Total probability and Bayes' rule.
6. Independence, and how it differs from disjointness.

The experiments in the lessons (coins, dice, cards, urns, a diagnostic test)
run as a seeded simulation in the browser, so a student can repeat one many
times and compare the frequencies against the computed answer.

### What "paper and pencil" means for this subject

- Write out the sample space for a described experiment and mark an event in
  it.
- Draw the tree for a multi-stage experiment and read a probability off it.
- Count the outcomes in an event without listing them.
- Compute a conditional probability, or reverse one with Bayes' rule, as an
  exact fraction.
- Decide whether two events are independent, and justify it.

### Deliverables

- 4 to 6 lessons in Markdown with visuals
- Problem set with authored step-by-step solutions for each lesson
- Quiz bank and printable quiz pages
- Reusable, parameterized visual components (the start of a library)

### Test

- Taught by the author, at Georgia Tech if the course is offered there, and
  by one other instructor.
- Outcome measured by a closed-book paper quiz, ideally against a group that
  learned from a standard textbook + LLM.
- Record what the second instructor needed that was missing.

### Out of scope

- The rest of Probability 1 (random variables onward)
- Students writing their own simulations in code
- Authoring tools for non-technical teachers
- Problem variants and randomized quizzes. Each problem has one fixed
  version. Variants are added later only if the teachers writing quizzes ask
  for them.
- The in-class kit and its present view. What a teacher needs on screen in
  class is not worked out yet, so it waits until the lessons exist.
- Any LLM at runtime
- Any backend or database
- The school layer: accounts, class codes, grades, student tracking
- Paid hosting, analytics

An AI tutor is not part of this project at any stage. If one is ever built,
the planned path is a separate company, and the product is a tutor that draws
and explains on screen in the style of The Organic Chemistry Tutor and Khan
Academy videos. That means developing an AI model, which takes research and
venture funding, and it is only worth starting if the open course gets
traction.

## Open questions

- Which Georgia Tech course does it map to, and which other universities'
  syllabi are the learning objectives checked against?
- Does the notation and topic order follow one widely used textbook, so a
  teacher can adopt it alongside an existing syllabus?
- Who is the second instructor for the pilot?

## Tech picks

| | Pick | In v1 |
|---|---|---|
| Content format | Plain Markdown, plus two directives | Yes |
| Problem schema | One file per problem, one fixed version, named solution steps | Yes |
| Visual components | Web Components, D3 or plain SVG | Yes |
| Site | Own shell: a build script and a Markdown parser, Vite when visuals arrive | Yes |
| Math and code | KaTeX, build-time highlighting | Yes |
| Print | HTML + print CSS | Yes |
| In-class kit | A "present" view of the lesson page | Later, not designed |
| Language and repos | TypeScript throughout, two repos | Yes |
| Identity and LMS | Standalone LMS; class code, then school sign-on | Deferred, school layer |

The picks marked v1 are the course layer. The deferred one is the school
layer, which is a separate repository and nothing in v1 depends on it.

The three that are expensive to change later are the content format, the
problem schema, and how visuals are packaged. Everything else can be swapped.

### Content format

Plain Markdown, one file per lesson. It is not tied to one toolchain, and a
lesson writer needs to know nothing but Markdown. Every piece of custom syntax
has to earn its place by doing something Markdown cannot. Two do:

- `::visual{name="..."}` places an interactive visual by name. The numbers a
  visual shows are written in the visual's own file, as a few readable lines
  at the top, and not in the lesson or in a separate data file.
- `:::details` is a drop-down that keeps a lesson short and holds the longer
  explanation for a reader who wants it. It is built when a lesson first needs
  one.

Everything else is ordinary Markdown. A lesson's title is its first line,
written as a `#` heading, and a lesson has no front matter. A discussion prompt is a blockquote, and
the motivating problem is the opening of the lesson. Practice problems are not
written into the lesson: `course.yaml` lists them per lesson and the site adds
them at the end of the page.

### Problem schema

One file per problem, with one fixed version of it: a statement and a
solution in plain Markdown. This is how a teacher already writes a problem, so
changing one or adding one needs nothing new. There are no variants, no
placeholders, and no seeds.

- Front matter for the title and the answer, body for the statement and the
  solution. Other keys (topic, difficulty) are allowed and not used yet.
- On a lesson page the whole solution, steps and answer, is in one box that
  the student opens. On a quiz page it is in the answer key.
- The solution is a `## Solution` heading, and each step under it is a
  `###` heading that names the step. No custom syntax.
- A quiz is a list of problem ids.
- Numeric answers are stored exact (a fraction or a closed form), with the
  decimal derived from it.
- Answers are not always numbers. Diagram problems (draw the tree, shade the
  event) use a figure plus a short marking guide.

### Practice quizzes and graded quizzes

Everything on the site is public, and an answer bank behind a login is ruled
out, so a published quiz cannot be the graded one.

- **Practice quizzes** belong to lessons. A lesson's `practice_quiz` list in
  `course.yaml` names the problems on it, and the lesson page ends with a
  link to print it. They are published with their answer keys. A student
  prints one, works it on paper, and checks it. They are not listed on the
  course home page.
- **Graded quizzes** are the teacher's own and never go on the site. They are
  listed in `private/quizzes.yaml`, and their problems are in
  `private/problems/`, in the same file format. Git ignores the `private/`
  folder. A private quiz may also use public problems.
- The dev server builds the private quizzes so the teacher can print them.
  The build that gets published leaves them out.
- A teacher makes a graded question by copying a public problem into
  `private/problems/` and changing it. This needs a local copy of the course;
  it cannot be done from GitHub's web editor.

The cost is that the course does not hand a teacher a ready graded quiz. If
teachers say writing their own is too much work, that is when variants or
generated numbers are reconsidered.

### Visual components

Web Components, drawn with D3 or plain SVG. three.js comes in only if a later
course needs 3D. The visual library is the core asset, and custom elements are the only packaging that outlives a
framework change.

- Every visual follows one base class and one parameter schema. That is the
  contract the LLM generates against, and it gives presentation mode and
  screenshot tests.
- The experiment simulation is one shared component: a seeded sampler that
  runs a described experiment many times and reports frequencies, reused by
  every visual (tree, outcome grid, area diagram). It is the most important
  component in the pilot.

### Site

An own shell, built on a Markdown parser. It is a plain build script that
writes HTML files, because the pages have no browser code yet. Vite comes in
with the visuals, when there is browser code to bundle. If this becomes a product,
the engine is what ships, and that needs the control. "Own" means owning the
shell, not rewriting the bundler or the parser.

- **Content core:** a library that parses lessons and problem files into
  structured data. Lesson pages and quiz pages read from it. This is the
  platform.
- **Shell:** turns that data into pages. Two page types (lesson, quiz). Thin and replaceable.
- Timebox the first version to about a week. If it slips, fall back to an
  existing generator; the core and the components carry over.

### Math and code

KaTeX, and build-time code highlighting. Math is authored in LaTeX syntax. Code
blocks are highlighted at build time so no
highlighting script ships to the browser.

### Print

HTML + print CSS, printed from the teacher's own browser. A quiz is a page at a
URL; the teacher presses print. No PDF toolchain, no server, and
math and figures render exactly as on the web. The answer key prints on a
separate page.

### In-class kit

Not in v1 and not designed. The starting idea is a "present" view of the
lesson page: full-screen visual, with the prompts beside it. Nothing to keep in sync with the lesson.

### Language and repos

TypeScript throughout, two repos. One language means the problem parser is
written once. Keeping the engine and the course content in separate repos is
what makes "fork the course" and separate licenses work.

`canonlearning/probability-1`, the course (content CC BY 4.0, code MIT):

- `course.yaml`: the manifest listing lessons, problems, and quizzes in
  order, with stable IDs that are never reused.
- `lessons/`: one Markdown file per section.
- `problems/`: one file per problem, with named solution steps.
- `visuals/`: components specific to this course, including the experiment
  simulation.
- `package.json` with the `dev` and `build` commands. They run the engine
  from the sibling `../canon` folder for now; a pinned version and the deploy
  config come when the site is published.

`canonlearning/canon`, the engine (MIT):

- Content core: the parser that turns lesson and problem files into structured
  data.
- Shell: the build that produces lesson pages and quiz pages.
- The visual base class and parameter schema, plus any visuals not tied to one
  subject.
- A small example course for testing.

### How a course gets the engine

For now the course runs the engine from a sibling folder: its `dev` and
`build` commands call `../canon/src/cli.ts`. That only works on a machine
with both repositories cloned side by side. It is kept while the author is
the only one building, because a change to the engine shows up in the course
at once, with no version to bump.

It changes when the site first goes online, because the automatic build
needs it too:

- The course's `package.json` names the engine as a dependency at a tagged
  version, pointing at the `canonlearning/canon` GitHub repository or at an
  npm package.
- Someone clones only the course repository and runs `npm install`, which
  downloads the engine.
- The engine gains a compile step. Node runs TypeScript directly from a local
  folder but refuses to for an installed dependency.
- A teacher with a fork edits files on GitHub and an automatic build
  publishes the site, so most teachers install nothing.

### Identity and LMS (deferred)

The school layer is a standalone LMS that a school self-hosts, not a tool
inside Canvas or Moodle. A class code comes first, then sign-on through the
school's identity provider and rosters from its systems. No username/password
auth of its own at any stage. The course layer never stores student data.

## Least sure of

- **The own shell** is the pick most likely to eat pilot time. Hold the
  timebox.
- **One fixed version per problem** means everyone in a room gets the same
  quiz. Put it in front of the teachers writing quizzes and see whether they
  want variants.
- **Print CSS** is adequate for quizzes, not for a polished book.

## References

- Protomaps, "Open core to open source":
  https://protomaps.com/blog/open-core-to-open-source/
