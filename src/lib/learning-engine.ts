export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  skillId: string;
  title: string;
  concept: string;
  content: string;
  example: string;
  minutes: number;
  questions: QuizQuestion[];
};

export type SkillPath = { id: string; title: string; description: string; lessons: Lesson[] };

import { skillPaths } from "./learning-catalog";
export { skillPaths };

export const allLessons = skillPaths.flatMap((p) => p.lessons);
const KEY = "skillforge.learning.v3";

export type LearningProgress = {
  xp: number;
  completedLessons: string[];
  answers: number;
  correct: number;
  lastActive: string;
  streak: number;
  bestStreak: number;
  sessionDates: string[];
  achievements: string[];
  reviewQueue: string[];
};

const empty = (): LearningProgress => ({
  xp: 0, completedLessons: [], answers: 0, correct: 0, lastActive: "",
  streak: 0, bestStreak: 0, sessionDates: [], achievements: [], reviewQueue: [],
});

export function loadProgress(): LearningProgress {
  if (typeof window === "undefined") return empty();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || typeof raw !== "object") return empty();

    const source = raw as Partial<LearningProgress>;
    const answers = Number.isFinite(source.answers) ? Math.max(0, Number(source.answers)) : 0;
    const correct = Number.isFinite(source.correct) ? Math.max(0, Math.min(Number(source.correct), answers)) : 0;
    const xp = Number.isFinite(source.xp) ? Math.max(0, Number(source.xp)) : 0;

    return {
      ...empty(),
      xp,
      completedLessons: Array.isArray(source.completedLessons)
        ? [...new Set(source.completedLessons.filter((id): id is string =>
            typeof id === "string" && allLessons.some((lesson) => lesson.id === id)))]
        : [],
      answers,
      correct,
      lastActive: typeof source.lastActive === "string" ? source.lastActive : "",
      streak: Number.isFinite(source.streak) ? Math.max(0, Number(source.streak)) : 0,
      bestStreak: Number.isFinite(source.bestStreak) ? Math.max(0, Number(source.bestStreak)) : 0,
      sessionDates: Array.isArray(source.sessionDates)
        ? [...new Set(source.sessionDates.filter((date): date is string =>
            typeof date === "string" && /^\\d{4}-\\d{2}-\\d{2}$/.test(date)))].sort()
        : [],
      achievements: Array.isArray(source.achievements)
        ? [...new Set(source.achievements.filter((id): id is string => typeof id === "string"))]
        : [],
      reviewQueue: Array.isArray(source.reviewQueue)
        ? [...new Set(source.reviewQueue.filter((id): id is string =>
            typeof id === "string" && allLessons.some((lesson) => lesson.id === id)))]
        : [],
    };
  } catch {
    return empty();
  }
}
export function saveProgress(p: LearningProgress) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(p));
}
export function resetProgress() { if (typeof window !== "undefined") localStorage.removeItem(KEY); return empty(); }
export function exportProgress(p: LearningProgress) {
  return JSON.stringify({ format: "skillforge-learning", version: 3, exportedAt: new Date().toISOString(), progress: p }, null, 2);
}
export function importProgress(raw: string) {
  const data = JSON.parse(raw);
  const source = data?.progress;

  if (
    data?.format !== "skillforge-learning" ||
    !source ||
    typeof source !== "object" ||
    !Array.isArray(source.completedLessons) ||
    !Array.isArray(source.sessionDates) ||
    !Array.isArray(source.achievements) ||
    !Array.isArray(source.reviewQueue) ||
    typeof source.xp !== "number" ||
    typeof source.answers !== "number" ||
    typeof source.correct !== "number" ||
    typeof source.streak !== "number" ||
    typeof source.bestStreak !== "number"
  ) {
    throw new Error("Invalid SkillForge progress file");
  }

  const p: LearningProgress = {
    xp: Math.max(0, source.xp),
    completedLessons: source.completedLessons.filter((id): id is string => typeof id === "string" && allLessons.some((l) => l.id === id)),
    answers: Math.max(0, source.answers),
    correct: Math.max(0, Math.min(source.correct, source.answers)),
    lastActive: typeof source.lastActive === "string" ? source.lastActive : "",
    streak: Math.max(0, source.streak),
    bestStreak: Math.max(0, source.bestStreak),
    sessionDates: [...new Set(source.sessionDates.filter((date): date is string => typeof date === "string"))].sort(),
    achievements: [...new Set(source.achievements.filter((id): id is string => typeof id === "string"))],
    reviewQueue: [...new Set(source.reviewQueue.filter((id): id is string => typeof id === "string" && allLessons.some((l) => l.id === id)))],
  };

  saveProgress(p);
  return p;
}
export function lessonsForSkill(id: string) { return skillPaths.find((p) => p.id === id)?.lessons ?? []; }
export function isUnlocked(lesson: Lesson, p: LearningProgress) {
  const lessons = lessonsForSkill(lesson.skillId);
  const i = lessons.findIndex((x) => x.id === lesson.id);
  return i <= 0 || p.completedLessons.includes(lessons[i - 1].id);
}
const day = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
};

function updateStreak(n: LearningProgress) {
  const today = day();
  if (!n.sessionDates.includes(today)) n.sessionDates.push(today);
  n.streak = calculateCurrentStreak(n.sessionDates);
  n.bestStreak = Math.max(n.bestStreak, n.streak);
  n.lastActive = new Date().toISOString();
}

function calculateCurrentStreak(sessionDates: string[]) {
  const unique = [...new Set(sessionDates)].sort().reverse();
  if (!unique.length || unique[0] !== day()) return 0;

  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const current = new Date(`${unique[i - 1]}T00:00:00`);
    const previous = new Date(`${unique[i]}T00:00:00`);
    const diff = Math.round((current.getTime() - previous.getTime()) / 86_400_000);
    if (diff !== 1) break;
    streak++;
  }
  return streak;
}

export function recordAnswer(p: LearningProgress, lesson: Lesson, correct: boolean) {
  const n = { ...p, completedLessons: [...p.completedLessons], sessionDates: [...p.sessionDates],
    achievements: [...p.achievements], reviewQueue: [...p.reviewQueue] };
  n.answers++;
  if (correct) { n.correct++; n.xp += 10; }
  else if (!n.reviewQueue.includes(lesson.id)) n.reviewQueue.push(lesson.id);
  updateStreak(n);
  if (n.answers >= 1 && !n.achievements.includes("first-answer")) n.achievements.push("first-answer");
  saveProgress(n);
  return n;
}

export function completeLesson(p: LearningProgress, lesson: Lesson) {
  const n = { ...p, completedLessons: [...p.completedLessons], achievements: [...p.achievements],
    reviewQueue: [...p.reviewQueue] };
  if (!n.completedLessons.includes(lesson.id)) {
    n.completedLessons.push(lesson.id);
    n.xp += 25;
  }
  n.reviewQueue = n.reviewQueue.filter((id) => id !== lesson.id);
  if (n.completedLessons.length >= 5 && !n.achievements.includes("five-lessons")) n.achievements.push("five-lessons");
  if (n.completedLessons.length >= allLessons.length && !n.achievements.includes("all-lessons")) n.achievements.push("all-lessons");
  saveProgress(n);
  return n;
}

export const accuracy = (p: LearningProgress) => p.answers ? Math.round((p.correct / p.answers) * 100) : 0;
export function recommendedLesson(p: LearningProgress): Lesson {
  const fallback = allLessons[0];
  if (!fallback) throw new Error("SkillForge has no lessons configured");

  return allLessons.find((l) => p.reviewQueue.includes(l.id) && isUnlocked(l, p))
    ?? allLessons.find((l) => isUnlocked(l, p) && !p.completedLessons.includes(l.id))
    ?? fallback;
}