import { createFileRoute } from "@tanstack/react-router";
import { Award, CheckCircle2, Flame, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { loadProgress, accuracy, skillPaths } from "@/lib/learning-engine";

export const Route = createFileRoute("/progress")({ component: Progress });

function Progress() {
  const p = loadProgress();

  return <AppShell title="Your progress" eyebrow="Learning performance">
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-md border border-border bg-card p-5"><Target className="size-5 text-primary" /><p className="mt-3 text-xs font-bold uppercase text-primary">Accuracy</p><p className="mt-1 text-2xl font-bold">{accuracy(p)}%</p><p className="text-xs text-muted-foreground">{p.correct}/{p.answers} correct</p></div>
      <div className="rounded-md border border-border bg-card p-5"><Flame className="size-5 text-primary" /><p className="mt-3 text-xs font-bold uppercase text-primary">Streak</p><p className="mt-1 text-2xl font-bold">{p.streak} days</p><p className="text-xs text-muted-foreground">Best: {p.bestStreak} days</p></div>
      <div className="rounded-md border border-border bg-card p-5"><Award className="size-5 text-primary" /><p className="mt-3 text-xs font-bold uppercase text-primary">Achievements</p><p className="mt-1 text-2xl font-bold">{p.achievements.length}</p><p className="text-xs text-muted-foreground">{p.xp} XP earned</p></div>
    </div>
    <section className="mt-6 rounded-md border border-border bg-card p-6">
      <p className="text-xs font-bold uppercase text-primary">Path progress</p>
      <div className="mt-5 space-y-5">{skillPaths.map((path) => { const done = path.lessons.filter((lesson) => p.completedLessons.includes(lesson.id)).length; const pct = Math.round(done / path.lessons.length * 100); return <div key={path.id}><div className="flex justify-between text-sm"><span className="font-semibold">{path.title}</span><span className="text-muted-foreground">{done}/{path.lessons.length}</span></div><div className="mt-2 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div></div>; })}</div>
    </section>
    <section className="mt-6 rounded-md border border-border bg-card p-6">
      <p className="text-xs font-bold uppercase text-primary">Review queue</p>
      {p.reviewQueue.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No lessons currently need review.</p> : <div className="mt-3 space-y-2">{p.reviewQueue.map((id) => { const lesson = skillPaths.flatMap((path) => path.lessons).find((item) => item.id === id); return <p key={id} className="flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-primary" />{lesson?.title ?? id}</p>; })}</div>}
    </section>
  </AppShell>;
}
