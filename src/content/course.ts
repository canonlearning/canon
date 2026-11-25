// Reads course.yaml, the manifest at the root of a course folder. It
// lists the lessons in order, and for each lesson its practice problems
// and its lecture decks.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type Course = {
  dir: string;
  title: string;
  description: string;
  // Where the course's files can be read on the web, such as
  // "https://github.com/canonlearning/probability-1/blob/main". The home
  // lesson page uses it to link to its Markdown file and its slides' file.
  // Undefined when course.yaml has no "source".
  sourceUrl: string | undefined;
  lessons: LessonEntry[];
};

export type LessonEntry = {
  id: string;
  // One casual sentence about the lesson, shown after its title on the
  // home page. Empty when course.yaml gives none.
  summary: string;
  // The practice problems shown at the end of the lesson.
  problemIds: string[];
  // The slide decks for teaching the lesson in class.
  lectureIds: string[];
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
  if (manifest.source !== undefined && typeof manifest.source !== "string") {
    throw new Error(`${file}: "source" must be a web address.`);
  }
  if (!Array.isArray(manifest.lessons) || manifest.lessons.length === 0) {
    throw new Error(`${file}: needs a "lessons" list with at least one lesson.`);
  }

  const lessons = manifest.lessons.map((entry: any, index: number) => {
    const name = `lesson ${index + 1}`;
    return {
      id: requireString(entry?.id, `${file}: ${name} needs an "id".`),
      summary: typeof entry?.summary === "string" ? entry.summary : "",
      problemIds: stringList(entry?.problems, `${file}: the "problems" of ${name}`),
      lectureIds: stringList(entry?.lectures, `${file}: the "lectures" of ${name}`),
    };
  });

  return {
    dir: courseDir,
    title: manifest.title,
    description: manifest.description ?? "",
    sourceUrl: manifest.source?.replace(/\/$/, ""),
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
    throw new Error(`${what} must be a list of ids.`);
  }
  return value;
}
