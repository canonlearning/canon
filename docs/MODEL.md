# Model

How the project divides into an open course and a school LMS, and how it is
funded. The [README](../README.md) has the premise and the
[plan](PLAN.md) has the pilot.

## Two layers

The project divides in two, and the line between them is whether the software
needs to know who the student is.

| | The course | The school layer |
|---|---|---|
| What it is | Lessons, visuals, in-class kit, problem bank, printable quizzes | Grades, student tracking, rosters |
| Knows who the student is | No | Yes |
| Runs as | A static site | A service with logins and a database |
| Who runs it | Anyone: the author, a teacher with a fork | A school, on its own systems |
| Plugs into | Nothing | The school's logins and rosters |
| Needed to teach the course | Yes | No |

**The course** is the open display of information and the structure around
it. A student can read it without an account, and a teacher can run a whole
class from it out of the box: present the visuals, assign the practice, print
the quizzes, and mark them by hand in whatever gradebook they already keep. It
stores no student data.

**The school layer** is a standalone LMS. Once a teacher wants grades recorded and
students tracked, the software holds student records, and those belong to the
school. So this layer is deployed by a school and plugs into what the school
already has. It is open source and self-hostable like the course, and it is a
separate piece of software.

The school layer is not being built yet. It waits on evidence that people
like the course: students working through it and teachers other than the
author running it. Until then the course is the whole project.

The rules that keep the line clean:

- The course never depends on the school layer. Everything in it works with
  no server and no account.
- Anything that does not need to know who the student is belongs in the
  course.
- The school layer adds to a course and never gates it. No lesson, problem, or
  answer is available only through it.

## The school layer

It records the marks from paper quizzes, tracks which practice each student
has done, and holds the roster for a class.

- **It plugs into the school.** Logins come from the school's identity
  provider and rosters from its systems. It is a standalone LMS, not a tool
  inside another one.
- **Grades still come from paper.** The school layer records what the teacher
  marked. It does not grade work done at home.
- **Leaving is easy.** A school can export everything, and can drop the school
  layer and keep teaching the course.

## Open model

- Both layers are open source and self-hostable. The engine is MIT.
- Course content is CC BY 4.0: anyone can adopt, edit, and resell it with
  credit. Code inside a course (visuals, snippets) is MIT.
- Every hook needed to self-host is provided and documented. Leaving a hosted
  service for a self-hosted one is meant to be easy.
- Nothing is held back to sell, and nothing open moves behind a paywall later.

## Funding

The model follows Protomaps, which moved from open core to fully open source
and is paid for its author's time instead of for access to the software. It is
not a good way to make money. It is a way to keep the course open and
maintained.

The course is easy to self-host, so there is nothing to charge for in running
it. The school layer is hard to run for real reasons (logins, student records,
integration with a school's systems), so that is where paid help has value.

In rough order of expected size:

- **Grants.** Open educational resources have dedicated funders: federal
  undergraduate education programs, foundations, and state programs that pay
  faculty to replace paid textbooks.
- **Commissioned courses and features.** A department, company, or foundation
  pays for the next course or for a feature, and it ships open.
- **Deploying and supporting the school layer.** A school pays for help
  connecting it to its systems, for support, or for a hosted instance at a
  flat fee, with a documented path back to self-hosting.
- **Paid access to the author.** Adapting a course to a school's syllabus,
  notation, or exam format; training teachers to run a paper-first class with
  the in-class kit; priority on the roadmap. No long-term commitment.
- **Sponsorship.** Individuals and institutions. Expected to cover running
  costs and little more.
- **Print.** Workbooks and problem books sold at a margin. The PDFs stay free.

Individual teachers have no budget, so the money comes from departments,
schools, and funders.

What this rules out:

- An exam or answer bank behind a paywall or an instructor login.
- A non-commercial content license with paid commercial terms.
- A school layer that is closed, or sold on being hard to leave.
