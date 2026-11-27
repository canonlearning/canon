# Plan

What is built, the pilot scope, then the tech picks. The premise and design
principles are in the [README](../README.md), and the two layers and funding
are in the [model](MODEL.md).

## What is built

- **The engine**, in this repository: it reads a course folder and writes
  lesson pages, practice problems with worked solutions, and lecture decks.
- **Two lessons of Probability 1**, conditional probability and Bayes'
  rule, each with its visuals, practice problems (five and six), and one
  lecture deck in two parts.
- **Publishing.** A course builds and publishes with a GitHub Action, and
  is served at `canonlearning.ai/probability-1`.
- **The landing site**, `canonlearning.ai`, with the about page: the
  repository `canonlearning/canonlearning.github.io`, plain HTML.
- **The guides**, `canonlearning.ai/docs`: the repository
  `canonlearning/docs`, built with mdBook.

## Pilot scope (v1)

v1 is the course layer only: a static site with no server, no LLM at
runtime, and no accounts. It is the first two-week unit of Probability 1, a
first university course in probability. The school layer is not started
until students and other teachers are using the course.

College comes first because the author teaches at a university and a
professor is free to change how a class is taught. Probability 1 comes first
because the author knows it, and its objectives are close to standard from
one university to the next.

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
2. The axioms, and what follows from them: complements, unions,
   inclusion-exclusion.
3. Counting equally likely outcomes: permutations and combinations.
4. Conditional probability and the multiplication rule: tree diagrams.
   Built.
5. Total probability and Bayes' rule.
6. Independence, and how it differs from disjointness.

On paper, a student of this unit writes out a sample space, draws the tree
for an experiment with several stages, counts outcomes without listing them,
computes a conditional probability as an exact fraction, and decides whether
two events are independent.

### Test

- Taught by the author, at Georgia Tech if the course is offered there, and
  by one other instructor.
- Outcome measured by a closed-book paper quiz, ideally against a group that
  learned from a standard textbook and an LLM.
- Record what the second instructor needed that was missing.

### Out of scope

- The rest of Probability 1 (random variables onward)
- Students writing their own simulations in code
- An editor for teachers. The guides explain the files and the setup.
- Quizzes, problem variants, placeholders, and seeds
- Any backend, database, or analytics
- Any LLM at runtime, apart from the tutor experiment below
- The school layer: accounts, class codes, grades, student tracking

## Open questions

- Which Georgia Tech course does it map to, and which other universities'
  syllabi are the learning objectives checked against?
- Does the notation and topic order follow one widely used textbook, so a
  teacher can adopt it alongside an existing syllabus?
- Who is the second instructor for the pilot?

## Tech picks

| | Pick |
|---|---|
| Content format | Plain Markdown, plus the `::visual` directive |
| Problem schema | One file per problem, one fixed version, named solution steps |
| Visual components | Web Components on one base class, drawn with three.js or SVG |
| Site | Own shell: a build script, a Markdown parser, esbuild for the visuals |
| Math | KaTeX at build time |
| Print | HTML and print CSS, from the reader's browser |
| In-class kit | Markdown slide decks, each built to one HTML file |
| Language and repos | TypeScript; one repository for the engine, one per course |

The first three are expensive to change later. Everything else can be
swapped.

### Content format

One Markdown file per lesson, so a writer needs to know nothing else and the
content is not tied to a toolchain. Custom syntax has to do something
Markdown cannot.

- `::visual{name="..."}` places a visual by name.
- A `:::details` drop-down, for a longer explanation, is planned and not
  built.
- A lesson's title is its first line. There is no front matter.
- A callout is a blockquote with bold words at its start as its label.
- Practice problems are not written into a lesson. `course.yaml` lists them
  and the site adds them at the end of the page.

### Problem schema

One file per problem, as a teacher already writes one: a statement and a
worked solution.

- Front matter holds the title and the answer. Other keys are allowed and
  not used.
- The solution is a `## Solution` heading, and each `###` heading under it
  names a step.
- Numeric answers are exact (a fraction or a closed form).
- A problem that asks for a diagram is answered with a figure.

The course publishes no quizzes and the engine builds none. Everything on
the site is public, so a published quiz cannot be the graded one. A graded
quiz is the teacher's own, written by changing the published problems.

### Visual components

Custom elements are the packaging that outlives a framework change, and the
visual library is the core asset. [VISUALS.md](VISUALS.md) has the look and
how to write one.

- Every visual extends one base class and draws inside one figure frame.
  That is the contract an LLM generates against.
- One file per visual in the course's `visuals/` folder, named as the lesson
  names it.
- A visual used once keeps its numbers at the top of its file. A reused one
  takes them from its `::visual` line.
- A seeded simulation that runs an experiment many times is not built.

### Everything else

- **Site.** The content core parses a course into data and is the platform.
  The shell that turns the data into pages is thin and replaceable. Every
  link is relative, so a built site works at any address.
- **Math.** Written in LaTeX syntax. Code blocks are not highlighted; that
  is added, at build time, when a course shows code.
- **Print.** A lesson is a page, and the reader presses print. A visual
  prints as a picture of its last step.
- **In-class kit.** A lesson page is not shown in class, so each lesson has
  a deck. A deck is Markdown so that a teacher can change it with an LLM,
  and it builds to one file that opens with no network. `AGENTS.md` has how
  a deck is written. Not built: a full-screen page for each visual, and
  addresses that carry a version.
- **Repos.** A course installs the engine with npm from GitHub, so someone
  clones only the course. The engine has no compile step and no tagged
  versions, and a course has no lock file, so it always builds with the
  newest engine. If that breaks a course, the course is updated.
- **School layer.** Deferred; see the [model](MODEL.md).

## Experiments

Neither is built, and neither changes the course layer.

### Short videos

A vertical video of under a minute that walks through one example from a
lesson. The author is trying this by hand first.

- The picture is rendered from code with Remotion, reusing the flat slide
  drawings, because a video model cannot draw a correct table or fraction.
- The voice is text-to-speech from ElevenLabs, read from a script.
- An agent drafts each short, and a person checks it before it is
  published.

### Tutor

A student on a lesson page asks a question, typed or spoken, and gets a
short explanation with a drawing. It is not started until students are
using a course.

- The code is open and the tutor is optional. A lesson never depends on it.
- Whoever runs a site pays for its questions. A small relay holds the model
  key. The one on `canonlearning.ai` uses the author's key, and a fork runs
  its own.
- The answer is in the lesson format: a few sentences and a `::visual` line
  with the student's numbers, so the picture is exact. A question that no
  visual fits gets text only.
- It explains and then asks for the work on paper. It does not work a
  practice problem for the student.
- It keeps no record tied to a person.
- Spending is capped: a couple of hundred dollars a month on
  `canonlearning.ai` to start, and a limit per visitor.

## Least sure of

- **No quizzes** means the course does not hand a teacher anything to grade.
  Ask the teachers using it whether writing their own is too much work.
- **Print CSS** is adequate for a lesson, not for a polished book.

## References

- Protomaps, "Open core to open source":
  https://protomaps.com/blog/open-core-to-open-source/
