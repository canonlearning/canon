# Canon Learning

*An open, visual, paper-first course a teacher can adopt whole.*

Site: [canonlearning.ai](https://canonlearning.ai). This repository is the
engine. The first course is
[Probability 1](https://github.com/canonlearning/probability-1). So far the
engine turns a course folder into a static site: Markdown lessons with
typeset math and interactive visuals drawn with three.js, practice problems
with worked solutions, and lecture slide decks, each built from Markdown into
one HTML file. One lesson exists, with five problems and two decks. The
[plan](docs/PLAN.md) has the pilot scope and the tech picks.

## Premise

LLMs have made explanations free and homework answers free, and students'
fundamentals are eroding as a result. Textbooks are not the fix. The fix is a
complete, adoptable course built on three things:

1. **Interactive visuals** that teach concepts better than static text.
2. **Paper and pencil** as the place where learning and assessment actually
   happen.
3. **A teacher whose job is the "why"**: motivation and interest, not content
   delivery.

An expert writes the course once. Teachers adopt it and can edit and tweak it
how they like. Students read and practice on the site, and prove what they
know on paper.

## The bet

A course with strong visuals, a real problem sequence, and paper-based
assessment produces better fundamentals than textbook + LLM. Teachers will
adopt a complete course, not just a reading, if it covers what they need to
run a class.

The largest unknown is adoption by a teacher who is not the author.

## Who it is for

A student can find the course and work through it alone. It is an open
resource that stands on its own, with no teacher and no account needed. A
teacher can adopt the same course as a course in a box, and run it as is or
tweak it how they like.

Schools come later. Grades and student tracking need student records, which
belong to a school, so they live in a separate, open, self-hosted LMS. It is
not started and will not be until people are using the course.

## What a course contains

| Part | Contents |
|---|---|
| Reading | Markdown lessons with embedded interactive visuals |
| In-class kit | A slide deck per lecture, written in Markdown with the live visuals: one motivating problem, discussion prompts |
| Problems | Worked examples, problem sets with solutions |
| Logistics | Syllabus map, pacing guide |

## Design principles

- **Homework is ungraded practice, done by hand.** Any take-home problem can be
  done by an LLM, so it is not a measure.
- **Grades come from short in-class paper quizzes.** The published
  problems are for practice, since their solutions are public. A teacher
  writes the graded quiz, starting from those problems, and keeps it private.
- **Content is forkable.** Lessons are Markdown, so teachers can reorder, cut,
  and add examples.
- **LLMs help the author freely.** Visuals are drafted with an LLM and verified
  by the expert before they ship.

## Positioning

Against a textbook, the course is interactive, free to read, and comes with
the in-class kit and the problem bank. Against online homework systems, which
grade take-home answers that an LLM can now produce, homework here is practice
and the grade is on paper. Against a general chatbot, the worked solutions are
expert-written and the grade depends on paper. Against videos and visual explainers, it is a full
course a teacher can run, not supplementary intuition.

## Open model

The platform is open source under the [MIT License](LICENSE) and
self-hostable. Course content is licensed
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), so anyone can
adopt, edit, and reuse it with credit. Nothing is
held back to sell. The model follows
[Protomaps](https://protomaps.com/blog/open-core-to-open-source/): possible
income is grants, commissioned courses and features, paid access to the
author, sponsorship, and later help running the school LMS. The expectation
is modest. This is a side project, and the course and its results are the
main asset.

The [model](docs/MODEL.md) has the two layers and the funding in detail.
