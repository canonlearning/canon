// Reads course.yaml, the manifest at the root of a course folder. It
// lists the lessons in order, and for each lesson its practice problems
// and the problems on its practice quiz.
//
// A practice quiz is published with its answer key, so it is for study and
// not for grading. A teacher's graded quizzes are private: they are listed
// in private/quizzes.yaml, a folder that git ignores, and they are built
// only on the teacher's own computer.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type Course = {
  dir: string;
  title: string;
  description: string;
  lessons: LessonEntry[];
  privateQuizzes: QuizEntry[];
};

export type LessonEntry = {
  id: string;
  // The practice problems shown at the end of the lesson.
  problemIds: string[];
  // The problems on the lesson's practice quiz. Empty means no quiz.
  practiceQuizProblemIds: string[];
};

export type QuizEntry = {
  id: string;
  title: string;
  problemIds: string[];
};

export function readCourse(courseDir: string): Course {
  const file = path.join(courseDir, "course.yaml");
  if (!existsSync(file)) {
    throw new Error(`${file}: not found. Run this from a course folder.`);
  }

  const manifest = parseYaml(readFileSync(file, "utf8"));

  if (typeof manifest?.title !== "string") {
    throw new Error(`${file}: needs a "title".`);
  }
  if (!Array.isArray(manifest.lessons) || manifest.lessons.length === 0) {
    throw new Error(`${file}: needs a "lessons" list with at least one lesson.`);
  }

  const lessons = manifest.lessons.map((entry: any, index: number) => {
    const name = `lesson ${index + 1}`;
    return {
      id: requireString(entry?.id, `${file}: ${name} needs an "id".`),
      problemIds: stringList(entry?.problems, `${file}: the "problems" of ${name}`),
      practiceQuizProblemIds: stringList(
        entry?.practice_quiz,
        `${file}: the "practice_quiz" of ${name}`,
      ),
    };
  });

  return {
    dir: courseDir,
    title: manifest.title,
    description: manifest.description ?? "",
    lessons,
    privateQuizzes: readPrivateQuizzes(courseDir),
  };
}

function readPrivateQuizzes(courseDir: string): QuizEntry[] {
  const file = path.join(courseDir, "private", "quizzes.yaml");
  if (!existsSync(file)) return [];
  return quizEntries(parseYaml(readFileSync(file, "utf8"))?.quizzes, file);
}

// A missing list of quizzes is an empty list.
function quizEntries(list: unknown, file: string): QuizEntry[] {
  if (list === undefined || list === null) return [];
  if (!Array.isArray(list)) throw new Error(`${file}: the quizzes must be a list.`);

  return list.map((entry: any, index: number) => {
    const name = `quiz ${index + 1}`;
    return {
      id: requireString(entry?.id, `${file}: ${name} needs an "id".`),
      title: requireString(entry?.title, `${file}: ${name} needs a "title".`),
      problemIds: stringList(entry?.problems, `${file}: the "problems" of ${name}`),
    };
  });
}

function requireString(value: unknown, message: string): string {
  if (typeof value !== "string") throw new Error(message);
  return value;
}

// A missing list is an empty list.
function stringList(value: unknown, what: string): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${what} must be a list of problem ids.`);
  }
  return value;
}
