# Plan

The pilot scope, then the tech picks. The premise and design principles are in
the [README](../README.md), and the two layers and funding are in the
[model](MODEL.md).

## First milestone

One thin slice, which is also the definition of done for the shell timebox:

1. One lesson (conditional probability) with the experiment simulation as its
   visual.
2. One Bayes' rule problem with a three-step solution.

Both are built. The lesson is built around two visuals. In the crowd, 1000
balls, one per person, arrive one after another, pass the test, and land on
four stacks by test result and condition. The share of positive tests that
belong to people with the condition settles as they arrive. A slider changes
how common the condition is. The student draws the tree on paper, and
the tree visual then builds itself one step at a time (branches, products,
the positive paths, the answer) with a sentence for each step.

The text says only what the visuals cannot: the definition, the
multiplication rule, and the link from the picture to the formula. The prompts
and the practice problem ask for work on paper (write down the counts, draw
the tree), not only a number.

The lesson ends with five practice problems, one for each skill it teaches,
in the order the lesson takes: count the outcomes of two dice, read a two-way
table ("and" against "given"), compare two given events that sound alike,
multiply along a tree whose branches change, and read a tree in reverse. A
problem may have several answers. Problems on base rates with three causes, a
negative result, or a second test wait for the lesson on Bayes' rule, and
problems on independence for that lesson.

The lesson has one lecture deck, in two parts for two classes, built by the
engine from Markdown with the same visuals (see "In-class kit" below).

Visuals are styled after the figures on gtcloudrobotics.com; see
[VISUALS.md](VISUALS.md).

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
- Quizzes, and problem variants. The course publishes practice problems and
  no quizzes, and each problem has one fixed version.
- A full-screen page for each visual, and versioned addresses.
- Short videos. They are an experiment outside v1; see "Short videos".
- Any LLM at runtime. A tutor that answers a student's question on the
  page is an experiment outside v1; see "Tutor".
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
| Visual components | Web Components, drawn with three.js, 2D or 3D | Yes |
| Site | Own shell: a build script, a Markdown parser, and esbuild for the visuals | Yes |
| Math and code | KaTeX, build-time highlighting | Yes |
| Print | HTML + print CSS | Yes |
| In-class kit | Markdown slide decks built by the engine, one HTML file each | Yes |
| Short videos | Remotion for the picture, ElevenLabs for the voice | No, an experiment |
| Tutor | A model answers in the lesson format, through a relay that holds the key | No, an experiment |
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
written as a `#` heading, and a lesson has no front matter. A callout is a blockquote, with bold words at its start as its label, and
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
  the student opens.
- The solution is a `## Solution` heading, and each step under it is a
  `###` heading that names the step. No custom syntax.
- Numeric answers are stored exact (a fraction or a closed form), with the
  decimal derived from it.
- Answers are not always numbers. Diagram problems (draw the tree, shade the
  event) use a figure plus a short marking guide.

### Quizzes

The course publishes no quizzes, and the engine builds none. Everything on
the site is public, and an answer bank behind a login is ruled out, so a
published quiz cannot be the graded one, and a published practice quiz would
repeat the practice problems on another page.

- A lesson's practice problems, with their worked solutions, are the
  practice.
- A graded quiz is the teacher's own. The teacher writes it by changing the
  published problems into new ones, outside the course.
- Making practice problems or quizzes on request is revisited with an LLM
  integration, which is out of scope for v1.

### Visual components

Web Components, drawn with three.js. The full toolset is available, and a
visual is 2D or 3D, whichever shows its example best. The look follows the
figures on gtcloudrobotics.com ([VISUALS.md](VISUALS.md)). The visual library is the core asset, and custom elements are the only packaging that outlives a
framework change.

- Every visual extends one base class and draws inside one figure frame
  (canvas, readout, controls, caption). That is the contract an LLM generates
  against. [VISUALS.md](VISUALS.md) has how to write one.
- One file per visual in the course's `visuals/` folder. The file name is the
  name a lesson uses in `::visual{name="..."}`.
- A visual that is used once keeps its numbers as constants at the top of
  its file. A visual that is reused takes them from its `::visual` line
  (`probability="1/10"`), which the engine hands to the visual as
  written. There is no schema that checks them; the visual reports a missing
  or malformed one.
- A problem may place a visual in its solution. It shows the work in a
  different form from the lesson (the lesson builds a tree, and the
  solution shows the same products as areas of a square), so the student
  checks a hand-drawn tree against a second picture and not a copy. On a
  printed lesson it is a still picture of its last step.
- A visual starts when it first comes near the screen, and a visual in a
  closed solution starts when the solution is opened. A page with many
  problems would otherwise open a 3D drawing for each at load, and a browser
  allows a limited number. A visual that has scrolled far away is not
  released; that is added when a page holds more visuals than a browser
  allows.
- The course's reusable visuals so far: a probability tree and an area
  square (two events in steps), a grid of equally likely outcomes (dice),
  and a two-way table of counts filled with balls.
- A shared experiment simulation (a seeded sampler that runs an experiment
  many times and reports frequencies) is not built. The crowd visual shows
  exact shares in a random arrival order, not random draws. It is built when a lesson needs to show
  frequencies settling toward a probability.

### Site

An own shell, built on a Markdown parser. It is a plain build script that
writes HTML files, and it bundles the course's visuals into one script with
esbuild. Vite is not used: there is one bundle and no framework, so a bundler
call is all that is needed. If this becomes a product,
the engine is what ships, and that needs the control. "Own" means owning the
shell, not rewriting the bundler or the parser.

- **Every link inside the site is relative.** The built site works at any
  address with no setting: the root of a domain, a folder of one
  (`canonlearning.ai/probability-1`), or a teacher's fork on another host.
- **Content core:** a library that parses lessons and problem files into
  structured data. Lesson pages read from it. This is the
  platform.
- **Shell:** turns that data into pages. Two page types (home, lesson). Thin and replaceable.
- Timebox the first version to about a week. If it slips, fall back to an
  existing generator; the core and the components carry over.

### Math and code

KaTeX, and build-time code highlighting. Math is authored in LaTeX syntax. Code
blocks are highlighted at build time so no
highlighting script ships to the browser.

### Print

HTML + print CSS, printed from the reader's own browser. A lesson is a page
at a URL; the reader presses print. No PDF toolchain, no server, and math
renders exactly as on the web. A visual prints as a still picture of its
last step.

### In-class kit

Lecture decks are built. Full-screen pages for the visuals and versioned
addresses are not. A lesson page is the reading for one or two lectures, and it is
not shown in class: a lecture runs in a different order (pose the question,
let the room answer, run the visual, work on paper, show the result), so a
"present" view of the lesson page is ruled out. The lesson is the fixed
reference. The course publishes its own deck for each lesson. Under its
title, a lesson page links to its slides and to the Markdown files of the
slides and of the page (from `source` in `course.yaml`). A teacher who
wants different slides copies the deck's Markdown file in a fork and
changes it.

A deck is a Markdown file, one per lesson, in the course's `lectures/`
folder, listed under its lesson in `course.yaml`. The engine turns it into
slides, and the course home page links to it. No external slide tool is used;
Marp, Slidev, and reveal.js are references for how Markdown slides behave.

- **A deck is led by visuals and uses new examples.** It does not repeat
  the lesson's text or its example: the lesson works a test for a
  condition, and its deck uses the Titanic's passengers, two dice, a
  late bus, and two students called on in turn. A lesson that takes two
  classes has one deck, with a slide that ends the first part. What the
  teacher says is in the notes.
- **A deck has its own look.** It is sans-serif on the lesson's paper
  color, with a slim
  headline, not the serif reading column of a lesson page. What is written
  on a slide decides its layout: a visual fills the slide, a list shows its
  points one at a time, a numbered list is the choices of a vote, a
  callout with a formula is a definition, a sentence with no headline is a
  takeaway, and a `# Heading` is a title or the end of a part.
- **A slide is built up one key press at a time.** A drawing moves one
  step, the points of a list appear one at a time, and a stacked
  calculation (`\begin{aligned}`) appears one line at a time. A row of dots
  at the bottom shows how many presses the slide has left.
- **A deck has its own drawings.** They are flat SVG visuals with large
  type, not the 3D visuals of the lesson page: a table of counts, a grid of
  outcomes, and a tree, each walked through with a caption at every step.
- **The teacher steps a visual.** On a lesson page a visual runs by itself.
  On a slide it waits at each step, and the arrow keys that change the slide
  move it forward or back a step first. A visual is written once, as a
  function of time, and its clock (`figure.timeline`) does the waiting.
- **The format is the lesson format.** The first line is the title. A line
  of `---` starts a new slide. Notes for the teacher are a callout labeled `**Notes**`; they are
  not shown to the room until the N key is pressed. No syntax is added. A deck with its notes is also
  the outline of the lecture: the opening question, the steps in order, the
  task on paper, one problem to work in class.
- **Markdown, because a teacher changes a deck with an LLM.** One text file
  goes into any model and comes back shorter, longer, or with another
  example, and the change shows as a diff. A slide file (PowerPoint, Google
  Slides) does not survive that, and it can hold only a picture of a visual.
- **The output is one file.** The build writes each deck as a single HTML
  file that holds everything it needs (styles, math fonts, scripts). It
  opens with no network, fills the screen with the F key, and moves with the
  arrow keys. It prints one slide to a page, with each visual as a still
  picture and the notes under each slide, for a handout or a fixed copy.
  A deck with visuals is about 1 MB, most of it three.js.
- **A full-screen page for each visual,** at its own address, showing only
  the figure and its controls, for a teacher who presents from another tool.
  Not built.
- **The look comes from one theme.** A deck has no layout controls. A
  teacher who wants free layout uses the PDF or another tool with the
  full-screen visual pages.

A teacher needs Node to build a deck, as for the rest of the course. Building
a changed deck without installing anything is not worked out.

A lesson and its visuals are the fixed reference, so their addresses are to
carry a version, so that a deck made one year still opens what it pointed to
after a lesson or a visual is revised. Not built.

### Short videos

Not built. The author is trying this out by hand first. A short is a
vertical video of under a minute that walks through one example from a
lesson (the Titanic table, the dice turned around, the late bus), so that
a student meets the same idea from one more direction. A short is free and
public like the rest of the course.

- **The picture is rendered from code, not from a video model.** A video
  model cannot draw a correct table or fraction. Remotion renders a video
  from web code, so the flat drawings made for the slides (a table, a grid,
  a tree, each already in steps with a caption) can be reused, and every
  number stays exact. Remotion also writes the captions and the vertical
  1080 by 1920 output.
- **The voice is text-to-speech** from ElevenLabs, read from a script.
- **An agent drafts each short**: the script, the choice of example, and
  the scene code. A person checks the numbers and the script before it is
  published, as for a problem or a visual.
- **Each short follows the class's order**: the question, a pause for the
  viewer to answer, the drawing walked through, the result in one sentence,
  then the address of the lesson.

Open: whose voice it is, where the shorts' source files live (this
repository, the course, or one of their own), and how a wide slide drawing
is laid out for a tall screen. None of this changes the course layer, and
no video tool is needed to build or read a course.

### Tutor

Not built, and not to be started until students are using a course. A
student on a lesson page asks a question, typed or spoken, and gets a short
explanation with a drawing. The experiment is to find out what students ask
and whether the answers help.

- **The code is open and the tutor is optional.** A course builds and reads
  the same without it. It is switched on by a setting that names a relay,
  and a lesson page never depends on the relay being up.
- **Whoever runs a site pays for its questions.** A model call needs a key,
  which a static page cannot hold, so a small relay holds it. The relay on
  `canonlearning.ai` uses the author's key. A fork gets the same tutor by
  running the relay with its own key. Nothing is held back: what a fork
  does not get is the author's money.
- **The answer is written in the lesson format, not drawn freehand.** The
  model returns a few sentences and a `::visual` line with the student's
  numbers (a tree, a table, a grid), and the page renders it with the
  course's own visuals, so the picture is exact and in the course's style.
  A question that no existing visual fits gets text only.
- **It sends the student back to paper.** The tutor explains an idea and
  then asks for the work by hand. It does not work a practice problem for
  the student.
- **It stores nothing about the student.** There are no accounts, so the
  relay keeps no record tied to a person, and the page says that a question
  is sent to a model provider.
- **Spending is capped.** The relay has a monthly limit (a couple of
  hundred dollars on `canonlearning.ai` to start) and a limit per visitor.
  When a limit is reached the page says so and the lesson is unaffected.

Open: which model, where the relay runs, how the question is spoken
(the browser's own speech recognition or a transcription service), and
whether the first trial is one lesson or the whole course.

### Language and repos

TypeScript throughout, two repos. One language means the problem parser is
written once. Keeping the engine and the course content in separate repos is
what makes "fork the course" and separate licenses work.

`canonlearning/probability-1`, the course (content CC BY 4.0, code MIT):

- `course.yaml`: the manifest listing lessons and their problems in order, with stable IDs that are never reused.
- `lessons/`: one Markdown file per section.
- `problems/`: one file per problem, with named solution steps.
- `lectures/`: one Markdown slide deck per lesson.
- `visuals/`: one TypeScript file per visual.
- `package.json` with the `dev` and `build` commands, and the engine as its
  one dependency.
- `.github/workflows/publish.yml`, which builds and publishes the site.

`canonlearning/canon`, the engine (MIT):

- Content core: the parser that turns lesson and problem files into structured
  data.
- Shell: the build that produces the pages.
- The visual base class, the figure frame, and the three.js stage.
- A small example course for testing.

### How a course gets the engine

A course's `package.json` lists the engine as a dependency, pointing at the
`canonlearning/canon` repository on GitHub. Someone clones only the course,
runs `npm install`, which downloads the engine, and then `npm run dev` or
`npm run build`. Both run the engine's `canon` command.

The engine has no compile step. Node runs TypeScript directly from a local
folder but refuses to for an installed dependency, so the `canon` command is
a small JavaScript file that loads the engine's TypeScript with esbuild.

A course has no lock file, so an install always gets the newest engine.
There are no tagged versions. If an engine change breaks a course, the
course is updated. Pinning a course to a tag is the change to make if that
becomes a burden.

To work on the engine and a course together, the author runs
`npm link ../canon` in the course, which makes the course use the engine
folder beside it.

Each course repository has a GitHub Action that installs the engine, builds
the course, and publishes it with GitHub Pages on every push. The landing
site, `canonlearning.ai`, is the repository
`canonlearning/canonlearning.github.io`, and GitHub serves a course
repository named `probability-1` at `canonlearning.ai/probability-1`. A fork
of a course publishes its own site the same way, so a teacher with a fork
can edit files on GitHub and install nothing.

### Identity and LMS (deferred)

The school layer is a standalone LMS that a school self-hosts, not a tool
inside Canvas or Moodle. A class code comes first, then sign-on through the
school's identity provider and rosters from its systems. No username/password
auth of its own at any stage. The course layer never stores student data.

## Least sure of

- **The own shell** is the pick most likely to eat pilot time. Hold the
  timebox.
- **No quizzes** means the course does not hand a teacher anything to grade.
  Ask the teachers using it whether writing their own from the practice
  problems is too much work.
- **Print CSS** is adequate for a lesson, not for a polished book.

## References

- Protomaps, "Open core to open source":
  https://protomaps.com/blog/open-core-to-open-source/
