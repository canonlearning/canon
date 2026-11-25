// Reads course.yaml, the manifest at the root of a course folder. It
// lists the lessons in order, and for each lesson its practice problems.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type Course = {
  dir: string;
  title: string;
  description: string;
  lessons: LessonEntry[];
};

export type LessonEntry = {
  id: string;
  // The practice problems shown at the end of the lesson.
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
    };
  });

  return {
    dir: courseDir,
    title: manifest.title,
    description: manifest.description ?? "",
    lessons,
  };
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
