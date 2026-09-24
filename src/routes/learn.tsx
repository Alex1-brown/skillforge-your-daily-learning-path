import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  skillPaths, loadProgress, recordAnswer, completeLesson, isUnlocked, accuracy,
  exportProgress, importProgress, type LearningProgress,
} from "@/lib/learning-engine";

export const Route = createFileRoute("/learn")({ component: Learn });

function Learn() {
  const [p, setP] = useState<LearningProgress>(() => loadProgress());
  const [skillId, setSkillId] = useState("python");
  const [index, setIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [lessonCorrect, setLessonCorrect] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const path = skillPaths.find((x) => x.id === skillId) ?? skillPaths[0];
  const lesson = path.lessons[index];
  const q = lesson.questions[questionIndex];

  useEffect(() => {
    setIndex(0); setQuestionIndex(0); setSelected(null); setChecked(false); setLessonCorrect(0);
  }, [skillId]);

  const progress = useMemo(
    () => Math.round((path.lessons.filter((l) => p.completedLessons.includes(l.id)).length / path.lessons.length) * 100),
    [path, p],
  );

  const chooseLesson = (i: number) => {
    setIndex(i); setQuestionIndex(0); setSelected(null); setChecked(false); setLessonCorrect(0);
  };

  const check = () => {
    if (selected === null || checked) return;
    const correct = selected === q.answer;
    setChecked(true);
    setLessonCorrect((v) => v + (correct ? 1 : 0));
    setP(recordAnswer(p, lesson, correct));
  };

  const nextQuestion = () => {
    if (!checked) return;
    if (questionIndex < lesson.questions.length - 1) {
      setQuestionIndex((v) => v + 1); setSelected(null); setChecked(false); return;
    }
    const finalScore = lessonCorrect + (selected === q.answer ? 1 : 0);
    if (finalScore === lesson.questions.length) {
      setP((current) => completeLesson(current, lesson));
    }
    if (index < path.lessons.length - 1 && (finalScore === lesson.questions.length)) chooseLesson(index + 1);
    else { setSelected(null); setChecked(false); }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportProgress(p)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "skillforge-progress.json"; a.click(); URL.revokeObjectURL(url);
  };

  const restore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    try { setP(importProgress(await f.text())); } catch { alert("Invalid SkillForge progress file."); }
    e.target.value = "";
  };

  return <AppShell title="Learning Engine" eyebrow="Learn by doing">
    <div className="mb-6 grid gap-3 sm:grid-cols-4">
      {skillPaths.map((s) => <button key={s.id} onClick={() => setSkillId(s.id)}
        className={`rounded-md border p-4 text-left ${skillId === s.id ? "border-primary bg-accent" : "border-border bg-card"}`}>
        <b>{s.title}</b><p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
        <p className="mt-2 text-xs text-muted-foreground">{s.lessons.length} lessons</p>
      </button>)}
    </div>
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <main className="rounded-md border border-border bg-card p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          {path.lessons.map((l, i) => {
            const ok = isUnlocked(l, p);
            const done = p.completedLessons.includes(l.id);
            return <button key={l.id} disabled={!ok} onClick={() => chooseLesson(i)}
              className={`rounded-md border px-3 py-2 text-sm font-semibold ${i === index ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"} ${!ok ? "opacity-40" : ""}`}>
              {i + 1}. {l.title}{done ? " ✓" : !ok ? " 🔒" : ""}
            </button>;
          })}
        </div>
        <p className="text-xs font-bold uppercase text-primary">Lesson {index + 1} · {lesson.minutes} min · Question {questionIndex + 1}/{lesson.questions.length}</p>
        <h2 className="mt-2 text-2xl font-bold">{lesson.title}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{lesson.concept}</p>
        <div className="mt-6 rounded-md border border-border bg-background p-5">
          <p className="text-sm font-semibold whitespace-pre-line leading-7">{lesson.content}</p>
          <pre className="mt-4 overflow-x-auto rounded-md bg-secondary p-4 text-sm leading-6">{lesson.example}</pre>
        </div>
        <div className="mt-6 rounded-md bg-secondary/60 p-5">
          <p className="text-sm font-bold">Practice</p>
          <p className="mt-3 font-semibold">{q.prompt}</p>
          <div className="mt-4 grid gap-2">
            {q.options.map((o, i) => <button key={o} disabled={checked} onClick={() => setSelected(i)}
              className={`rounded-md border p-3 text-left ${selected === i ? "border-primary bg-accent" : "border-border bg-card"}`}>{o}</button>)}
          </div>
          <Button className="mt-4" variant="forge" disabled={selected === null || checked} onClick={check}>Check answer</Button>
          {checked && <p className="mt-4 text-sm font-medium">{selected === q.answer ? "✓ Correct! +10 XP" : "✗ Not correct."} {q.explanation}</p>}
          {checked && <Button className="mt-4" variant="outline" onClick={nextQuestion}>
            {questionIndex < lesson.questions.length - 1 ? "Next question →" : "Finish lesson →"}
          </Button>}
        </div>
      </main>
      <aside className="rounded-md border border-border bg-card p-5">
        <p className="text-xs font-bold uppercase text-primary">Your learning</p>
        <p className="mt-2 text-3xl font-bold">{p.xp} XP</p>
        <p className="text-sm text-muted-foreground">{p.streak} day streak · best {p.bestStreak}</p>
        <div className="mt-5 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div>
        <p className="mt-2 text-sm">{progress}% of {path.title} complete</p>
        <p className="mt-5 text-sm">Accuracy: {accuracy(p)}%</p>
        <p className="mt-3 text-sm">Needs review: {p.reviewQueue.length}</p>
        <p className="mt-3 text-sm">Achievements: {p.achievements.length}</p>
        <div className="mt-5 grid gap-2">
          <Button variant="outline" onClick={download}>Export progress</Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>Import progress</Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={restore} />
        </div>
      </aside>
    </div>
  </AppShell>;
}