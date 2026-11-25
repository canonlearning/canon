// Reads course.yaml, the manifest at the root of a course folder.
//
// Only the title, the description, and the lesson list are read so far.
// The problems and quizzes listed in the manifest are not used yet.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type Course = {
  dir: string;
  title: string;
  description: string;
  lessonIds: string[];
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

  const lessonIds = manifest.lessons.map((lesson: unknown, index: number) => {
    const id = (lesson as { id?: unknown } | null)?.id;
    if (typeof id !== "string") {
      throw new Error(`${file}: lesson ${index + 1} needs an "id".`);
    }
    return id;
  });

  return {
    dir: courseDir,
    title: manifest.title,
    description: manifest.description ?? "",
    lessonIds,
  };
}
