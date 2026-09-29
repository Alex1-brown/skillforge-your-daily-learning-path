import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Target, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { loadProgress, accuracy, skillPaths, recommendedLesson } from "@/lib/learning-engine";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const p = loadProgress();
  const next = recommendedLesson(p);
  const completedByPath = skillPaths.map((path) => ({
    ...path,
    completed: path.lessons.filter((lesson) => p.completedLessons.includes(lesson.id)).length,
  }));
  const total = skillPaths.reduce((sum, path) => sum + path.lessons.length, 0);

  return <AppShell title="Your learning dashboard" eyebrow="SkillForge">
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-md border border-border bg-card p-5"><Flame className="size-5 text-primary" /><p className="mt-3 text-xs font-bold uppercase text-primary">Current streak</p><p className="mt-1 text-2xl font-bold">{p.streak} days</p><p className="text-xs text-muted-foreground">Best: {p.bestStreak} days</p></div>
      <div className="rounded-md border border-border bg-card p-5"><Trophy className="size-5 text-primary" /><p className="mt-3 text-xs font-bold uppercase text-primary">XP</p><p className="mt-1 text-2xl font-bold">{p.xp}</p><p className="text-xs text-muted-foreground">{p.completedLessons.length} lessons completed</p></div>
      <div className="rounded-md border border-border bg-card p-5"><Target className="size-5 text-primary" /><p className="mt-3 text-xs font-bold uppercase text-primary">Accuracy</p><p className="mt-1 text-2xl font-bold">{accuracy(p)}%</p><p className="text-xs text-muted-foreground">{p.reviewQueue.length} lesson{p.reviewQueue.length === 1 ? "" : "s"} to review</p></div>
    </div>

    <section className="mt-6 rounded-md border border-border bg-card p-6">
      <p className="text-xs font-bold uppercase text-primary">Continue learning</p>
      <h2 className="mt-2 text-2xl font-bold">{next.title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{next.concept}</p>
      <Button asChild variant="forge" className="mt-5"><Link to="/learn" search={{ skill: next.skillId, lesson: Math.max(0, skillPaths.find((path) => path.id === next.skillId)?.lessons.findIndex((item) => item.id === next.id) ?? 0) }}>Open lesson <ArrowRight /></Link></Button>
    </section>

    <section className="mt-8">
      <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase text-primary">Your skill paths</p><h2 className="mt-1 text-xl font-bold">{p.completedLessons.length} / {total} lessons completed</h2></div><Button asChild variant="ghost"><Link to="/skills">Skills <ArrowRight /></Link></Button></div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {completedByPath.map((path) => {
          const pct = Math.round(path.completed / path.lessons.length * 100);
          return <div key={path.id} className="rounded-md border border-border bg-card p-5"><h3 className="font-bold">{path.title}</h3><p className="mt-1 text-sm text-muted-foreground">{path.description}</p><div className="mt-4 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{path.completed}/{path.lessons.length} lessons · {pct}%</p></div>;
        })}
      </div>
    </section>
  </AppShell>;
}
