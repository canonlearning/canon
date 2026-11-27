# Making a new lesson

The procedure for taking a topic to a finished lesson: the reading, its
visuals, its practice problems, and its lecture deck. It is written for
whoever does the work, a person or an agent, so that the author does not
have to steer each step.

A lesson is not finished in one pass, and no pass is expected to be. The
work goes in the order below. Each pass has one job, ends with something the
author can look at, and is judged on that job only.

The rules for how a lesson, a problem, and a deck are written are in
`AGENTS.md` ("Lesson writing", "Lecture decks", "Designing something new")
and `docs/VISUALS.md`. This file is the order of work and the mistakes to
look for. It does not repeat those rules.

## The request

The author names the topic and nothing else is needed:

> Make the next lesson: independence. Follow `docs/NEW-LESSON.md`.

Work through the passes without asking for permission between them. Stop and
wait only at the two stops marked below, and before any commit or push. At
every other point, report in a few lines and continue.

## Effort

The author wants this done at high effort, and has said so as a standing
instruction. Do not economize on research or on review.

- **Research and review are done by many agents at once**, each with one
  narrow question and no knowledge of the others' answers. One agent asked
  five things returns five shallow answers. The passes below name the
  agents to run; add more where a question turns out to be large.
- **A reviewer is always fresh.** It gets the files and the question, not
  the plan, the history, or the conclusion hoped for. A review by whoever
  wrote the thing does not count.
- **Review is adversarial.** A reviewer is asked what is wrong, confusing,
  or weak, in order of how much it hurts. A review that returns only praise
  is run again with a harder question.
- **Every pass is reviewed, not only the last.** A weak example found in
  pass 2 costs minutes. Found in pass 7, it costs the lesson.
- **More than one candidate.** For the example, for the central figure, and
  for the deck's examples, produce several candidates from separate agents
  and choose among them. The first idea is rarely the best one, and it is
  usually the one closest to the last lesson.

## The content drives the format

Start from what is being taught. Ask what this idea is, how a person comes
to believe it, where they go wrong, and what picture or activity makes it
plain. The shape of the lesson follows from the answers: how many sections
it has, whether it counts first or draws first, what its figures are,
whether its deck has two parts or three, what the room does on paper.

The earlier lessons are examples of the method applied to their topics.
They are not templates. A topic about symmetry may have no crowd to count.
A topic about a limit may need a figure that runs for a long time. A topic
with one hard idea may be one section. Copying an earlier lesson's shape is
the usual mistake, because it is the easiest thing to do and it looks
right.

Fixed, because the engine and the reader depend on it:

- The lesson page, the figure frame (canvas, readout, controls, caption),
  the palette, the problem file format, and the deck format.
- The writing rules in `AGENTS.md`.
- A short reading. It is a first teaching pass, and depth goes in the
  practice problems: variants, a second method, an edge case, a harder
  version.

A default, kept unless the content argues against it:

- One motivating example that the reading works through from start to
  finish without interruption.

Decided fresh for every lesson, from the content:

- The kinds of picture. A new lesson's figures are designed for its own
  idea, and the range considered is wide: motion, space, time, a physical
  process, a game, a map, a machine, a crowd, a curve.
- The order of ideas and the number of sections.
- The devices: whether numbers are colored, how the lesson closes, what the
  paper task asks for.
- The deck's structure, its examples, and what the room does.

Before each pass is reported, check it against the last lesson. Where the
two match in shape, picture, or wording, there must be a reason from the
content. "The last lesson did it" is not one.

## Pass 1: read what exists, then research

1. Read the newest finished lesson, its problems, and its deck. Write down
   what each conveyed and why it works: the principles, not the parts. Note
   what the deck already taught that this lesson can start from.
2. Read `docs/PLAN.md` for where the topic sits in the sequence, and what
   comes before and after it.
3. Research with separate agents, run at once. At least these:
   - **The idea itself.** What it states, what it depends on, the standard
     notation, and the order in which strong courses build it.
   - **How people learn it.** Studies of teaching the topic: which
     representations help and by how much, and the wrong answers students
     give, with the reasoning behind each.
   - **How it has been drawn.** A wide survey of pictures, animations,
     physical demonstrations, and interactive explanations of the topic,
     from textbooks, lectures, museums, and the web. What each shows well
     and what it hides.
   - **Where it matters.** Real cases and real data, each with a source
     that can be checked, for the deck.
   - **Problems.** The kinds of problem set on the topic and what each
     tests. No source is copied into the course; a kind of scenario is a
     free idea.
   - **The hard part.** What experienced teachers say students never quite
     get, and the classic paradoxes and traps.
4. Then a second round: one agent reads all the findings and names what is
   thin, contradictory, or unsourced, and those gaps are researched again.
5. Report: what the lesson has to convey, the wrong answers it has to
   target, the pictures worth trying, and the data found.

## Pass 2: the spine

Decide these before writing a paragraph. For the example and the figures,
have several agents each propose candidates without seeing the others, then
choose.

- **The one example**, with its numbers. Choose numbers that give a result
  the reader does not expect (the case with the highest rate is the least
  likely one). Check that every answer is a clean exact fraction.
- **The sections**, as many as the content has ideas, each with the one
  idea it adds.
- **The paper task**, which asks for work by hand and not only a number.
- **The figures**, one per idea that a picture carries better than text.
  For each, say what kind of picture it is and why the content calls for
  that kind. If two figures are the same kind of picture, justify the
  second or change it.
- **The practice problems**, each with the one thing it adds that the
  reading leaves out.

Give the spine to two fresh reviewers: one asks whether a student would
care about the example and be surprised by it, and one asks where the spine
looks like the last lesson with the topic swapped. Fix what they find.

Report the spine in a short list and continue.

## Pass 3: the reading

Write the lesson in `lessons/`.

- Work the example first: by counting, then with probabilities. State the
  general rule after the example is finished, once, in its own section. Do
  not derive a rule in general before the example needs it, and do not
  interrupt the example to restate each step in symbols.
- Read it top to bottom as a student would. Cut what a first pass does not
  need and move it to a problem. A sentence that repeats an earlier result
  goes.
- Give it to three fresh readers with only the file. One reads as a
  student meeting the topic for the first time and marks every sentence
  that confused them. One reads as a teacher of the subject and marks what
  is wrong, loose, or missing. One checks it against "Lesson writing" in
  `AGENTS.md`. Fix what is found, and repeat with new readers until a round
  finds nothing that hurts.

The reading is short. If it is much longer than the lesson before it, the
extra is probably problem material.

## Pass 4: the figures

Build each figure as a working visual on the lesson page, in the figure
frame. Do not show ideas as sketches on a separate page or in another style.

The figures are most of the work of a lesson and get most of the effort.
For the central figure, build two or three different kinds of picture as
working visuals and compare them on the page before choosing. A figure that
is correct and dull is not done.

- Each figure is made for its own point. One reusable visual placed many
  times reads as one picture repeated, even when the numbers differ. Count
  how often each visual appears across the lesson and its problems. More
  than twice needs a reason.
- A figure that goes through steps shows nothing of a later step early.
- Numbers in a figure are written the way the text writes them: the same
  fractions, over the same bottoms.
- Look at every step of every figure in a browser, at desktop and at phone
  width. Check labels for overlap and clipping, and that nothing sits under
  the Pause button.
- After the figures exist, reread the text around each one. The text says
  only what the figure cannot, and describes the figure that is there.
- Give each figure, alone and without the lesson text, to a fresh reviewer
  who is asked what it shows. If the answer is not the figure's point, the
  figure is not carrying it. A second reviewer looks at all the figures of
  the lesson and its problems together and says where they look alike.

## Pass 5: the practice problems

Write each problem in `problems/` and list it in `course.yaml`.

- Each problem asks for something on paper, and adds one thing the reading
  left out.
- Compute every answer with exact fractions in a script.
- Give the statements alone, without the solutions, to a fresh solver. Its
  answers must match, and every place it found the wording unclear is fixed.
- A problem gets a figure only where one helps, and not the lesson's figure
  with new numbers by default. A table is often enough.

### Stop 1

Stop here. The lesson page is complete on the local server: reading,
figures, and problems. Report:

- The address of the page.
- What each section and figure does, in a few lines.
- What is rough, in order of how much it hurts.
- What has not been checked by a person.

Wait for the author. Expect changes to the figures more than to anything
else.

## Pass 6: the deck

1. Reread the previous deck. The new deck starts from what that one already
   taught.
2. Choose the deck's examples. They are not the reading's example. Real data
   comes first where it exists. Reusing an earlier deck's data is good when
   only one thing changes (the same people, cut a new way) and it has not
   been used in three decks running.
3. Write the slide order as a list and report it: slide, what happens, and
   for each vote the wrong answer it is built on. Continue without waiting.
4. Build the deck's own flat drawings, each for one idea, and write the
   deck in `lectures/`.
5. Look at every slide, fully built, in a browser at 1280 by 720. A script
   that checks for overflow is not enough: a formula can be cut off inside
   its box. A long formula is split over lines or shortened.

What goes wrong in a first pass of a deck:

- A vote that comes after the slide that answers it, or whose intended wrong
  answer nobody would pick. The most tempting wrong answer is usually the
  question turned around.
- A paper task whose numbers are on an earlier slide. Put the data on the
  task's slide.
- One result on three or more slides in a row, because a drawing, a
  calculation, and a list each state it.
- A calculation slide that restates a drawing and adds nothing.
- Names that clash: cases called A, B, C beside vote choices A, B, C, or
  beside the symbols of a rule.
- A percentage written as an equation that rounding makes false ("62% of
  325 = 203").
- A number on a slide whose source is only in the notes.
- A drawing and a calculation that write the same quantity two ways.
- Two parts of unequal length.

## Pass 7: third-party review

At least two fresh reviewers, neither given the plan or the lesson's
history. Add a third who has read only the lesson page and says where the
deck repeats it.

- One walks the deck in a browser at 1280 by 720: every key press from the
  first slide to the last, then back from the last to the first, as someone
  at the back of the room and as a teacher presenting it cold.
- One reads the deck's source front to back and then back to front,
  recomputes every number on the slides and in the drawings, and checks the
  deck against "Lecture decks" in `AGENTS.md`.

Fix what they find. Say which findings were left and why. A problem in the
engine that also affects earlier decks is reported and left for its own
change, unless a slide is wrong without the fix.

Run the same kind of review on the lesson page if it changed much after
Stop 1.

### Stop 2

Stop here. Report:

- The address of the deck and its length.
- What the review found and what was changed.
- What was not fixed.
- Everything that still needs a person: the hand-check of each problem and
  solution, each real number against its source, and each citation.

## Finishing

Only when the author asks:

- Update "What is built" in `docs/PLAN.md` and the course's README.
- Commit and push the engine first if it changed, then the course. Pushing
  the course publishes it.
- Confirm that the publishing run succeeded.

A problem is not hand-checked because a script and a solver agree. Say
plainly what went out unchecked.

## Reports

Every report is short and says:

- What was done, and where to look at it.
- What is rough, worst first. Not only what works.
- What was checked, and how: looked at in a browser, computed, or not
  checked.
- What comes next. Then continue, unless it is a stop.

## Working in the browser

- The course's `npm run dev` serves it at `http://localhost:4000` and
  rebuilds on save. Check whether it is already running before starting it.
- Screenshots go under `.playwright-mcp/` in this repository, which git
  ignores. Delete them afterward.
- A visual builds when it is scrolled near. Wait a moment after loading a
  page before pressing Replay.
- A figure's animation advances only while the page is waiting inside its
  own script, so wait there and not in the test tool.
- A solution's figures start when its drop-down is opened.
- In a deck, the address ends in the slide number (`#12`), and the right
  arrow builds the slide one piece at a time.
