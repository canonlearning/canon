# Making a new lesson

The order of work for taking a topic to a finished lesson: the reading, its
visuals, its practice problems, and its lecture deck. It is written for
whoever does the work, a person or an agent.

No lesson is expected to be made automatically, or in one pass. Each new
lesson needs heavy involvement from the author: reading every draft,
stopping the work, and asking for changes many times. A draft that the
author sends back is the normal course of the work, not a failure of it.

How a lesson, a problem, and a deck are written is in `AGENTS.md` ("Lesson
writing", "Lecture decks", "Designing something new") and
`docs/VISUALS.md`. This file does not repeat those rules, and it does not
say what a lesson should look like.

## Start from the content

Each lesson is a fresh view of its topic. Ask what the idea is, how a
person comes to believe it, where they go wrong, and what picture or
activity makes it plain. The shape of the lesson follows from the answers:
its example, its sections, its figures, its problems, and its deck.

The earlier lessons are examples of this method applied to their topics.
They are not templates, and what was changed in one lesson is not a rule
for the next. Copying an earlier lesson's shape is the usual mistake,
because it is the easiest thing to do and it looks right. Where a draft
matches the last lesson in shape, picture, or wording, there must be a
reason from the content.

Only these are fixed, because the engine and the reader depend on them:

- The lesson page, the figure frame, the palette, the problem file format,
  and the deck format.
- A short reading. Depth goes in the practice problems and the deck.

## The order of work

Work through the passes without asking between them, reporting in a few
lines after each. Stop at the two stops, and before any commit or push. The
author may also stop the work at any point.

The author wants this done at high effort, as a standing instruction. Do
not economize on research or on review: use many agents at once, each with
one narrow question.

1. **Research.** Read the newest finished lesson and `docs/PLAN.md` for
   where the topic sits. Then research widely, with separate agents for
   separate questions: the idea and how standard textbooks order it, how
   people learn it and the wrong answers they give, how it has been drawn,
   real data with sources, and the kinds of problem set on it.
2. **The spine.** Before writing, decide the example with its numbers, the
   sections, the figures, and the problems. Get several candidates for the
   example and the central figure from agents that do not see each other,
   and choose.
3. **The reading**, in `lessons/`.
4. **The figures**, built as working visuals on the lesson page. Look at
   every step of each in a browser, at desktop and phone width.
5. **The practice problems**, in `problems/` and `course.yaml`. Compute
   every answer exactly in a script, and have a fresh solver work the
   statements without the solutions.

**Stop 1.** The lesson page is complete on the local server. Report its
address, what is rough (worst first), and what a person has not checked.
Expect changes to everything.

6. **The deck**, in `lectures/`, with its own examples and its own flat
   drawings. Look at every slide, fully built, at 1280 by 720.
7. **Review** of the deck, and of the lesson page if it changed much.

**Stop 2.** Report the deck's address, what the review found, what was not
fixed, and everything that still needs a person: the hand-check of each
problem, each real number against its source, and each citation.

Commit, push, and update `docs/PLAN.md` only when the author asks. Pushing
the course publishes it.

## Review

A review is done by a fresh reader who gets the files and not the plan, the
history, or the conclusion hoped for. It is asked what is wrong, confusing,
or weak, worst first. A review that returns only praise is run again.

The questions below are the ones the author asks. They are for the reviewer
of a finished draft. They are not design rules, and whoever designs the
lesson does not work from them.

- What is the point of this section, in one sentence? Would a reader know
  it from the section's first lines?
- At each point in the reading, does the reader know what question is
  being answered?
- Does this idea belong to this lesson, or to the next one? What do the
  standard textbooks put in the matching section?
- How many new terms are there, and is each one needed?
- Does any sentence read like a textbook, or like the page describing
  itself?
- What is this figure trying to convey, shown to someone without the text?
  Does anything in it distract from that?
- Would a student be annoyed doing this task or problem? What does it
  practice?
- Do the problems cover what the standard textbooks practice for the
  topic? Would a figure help a solution?

## Working in the browser

- The course's `npm run dev` serves it at `http://localhost:4000` and
  rebuilds on save. Check whether it is already running before starting it.
- Screenshots go under `.playwright-mcp/` in this repository, which git
  ignores. Delete them afterward.
- A figure's animation advances only while the page is waiting inside its
  own script, so wait there and not in the test tool.
- A solution's figures start when its drop-down is opened.
- In a deck, the address ends in the slide number (`#12`), and the right
  arrow builds the slide one piece at a time.
