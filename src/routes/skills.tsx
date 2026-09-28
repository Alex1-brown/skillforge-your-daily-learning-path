import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { loadProgress, skillPaths } from "@/lib/learning-engine";

export const Route = createFileRoute("/skills")({ component: Skills });

function Skills() {
  const p = loadProgress();

  return <AppShell title="Choose your skill" eyebrow="Learning library">
    <p className="max-w-2xl text-sm leading-6 text-muted-foreground">These are the existing SkillForge paths. No new subjects are added; each path is built from its current topics.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {skillPaths.map((path) => {
        const done = path.lessons.filter((lesson) => p.completedLessons.includes(lesson.id)).length;
        const pct = Math.round(done / path.lessons.length * 100);
        return <article key={path.id} className="rounded-md border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold">{path.title}</h2><p className="mt-1 text-sm text-muted-foreground">{path.description}</p></div><span className="rounded-full bg-secondary px-2 py-1 text-xs font-bold">{pct}%</span></div>
          <div className="mt-4 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
          <p className="mt-2 text-xs text-muted-foreground">{done}/{path.lessons.length} lessons completed</p>
          <div className="mt-4 space-y-2">{path.lessons.map((lesson) => <div key={lesson.id} className="flex items-center gap-2 text-sm"><Check className={`size-4 ${p.completedLessons.includes(lesson.id) ? "text-primary" : "text-muted-foreground/30"}`} /><span>{lesson.title}</span></div>)}</div>
          <Button asChild variant="forge" className="mt-5 w-full"><Link to="/learn">Open {path.title} <ArrowRight /></Link></Button>
        </article>;
      })}
    </div>
  </AppShell>;
}
