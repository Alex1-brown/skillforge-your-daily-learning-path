import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { loadProgress, recommendedLesson, skillPaths } from "@/lib/learning-engine";

export const Route = createFileRoute("/daily")({ component: Daily });

function Daily() {
  const p = loadProgress();
  const lesson = recommendedLesson(p);
  const skill = skillPaths.find((path) => path.id === lesson.skillId) ?? skillPaths[0]!;
  const lessonIndex = Math.max(0, skill.lessons.findIndex((item) => item.id === lesson.id));

  return <AppShell title="Today's focus" eyebrow="Your next lesson" action={<div className="flex items-center gap-2 text-sm font-bold"><Clock3 className="size-4 text-primary" />{lesson.minutes} min</div>}>
    <div className="max-w-3xl">
      <section className="rounded-md border border-border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground"><Target /></span>
          <div><p className="text-xs font-bold uppercase text-primary">Learn → practice</p><h2 className="mt-2 text-2xl font-bold">{lesson.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{lesson.concept}</p></div>
        </div>
        <div className="mt-6 rounded-md bg-secondary/60 p-5">
          <p className="text-sm font-bold">How this works</p>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground"><li>1. Read the lesson and example.</li><li>2. Start the practice questions.</li><li>3. A wrong answer stays on the same question until you solve it.</li><li>4. Finish all questions to unlock the next lesson.</li></ol>
        </div>
        <Button asChild variant="forge" className="mt-5"><Link to="/learn" search={{ skill: skill.id, lesson: lessonIndex }}>Start lesson <ArrowRight /></Link></Button>
      </section>
    </div>
  </AppShell>;
}
