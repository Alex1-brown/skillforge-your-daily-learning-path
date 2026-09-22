import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock3, Flame, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "SkillForge — Turn minutes into mastery" },
    { name: "description", content: "Focused daily learning plans for English, Python, AI, and programming." },
    { property: "og:title", content: "SkillForge — Turn minutes into mastery" },
    { property: "og:description", content: "Focused daily learning plans for English, Python, AI, and programming." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Landing,
});

function Landing() {
  return <main className="min-h-screen overflow-hidden bg-background">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[44rem] forge-grid opacity-40" />
    <header className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold"><span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"><Sparkles className="size-4" /></span>SkillForge</Link>
      <Button asChild variant="ghost"><Link to="/dashboard">Open app</Link></Button>
    </header>
    <section className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl content-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20">
      <div className="max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-accent px-3 py-1.5 text-xs font-bold uppercase text-accent-foreground"><span className="size-1.5 rounded-full bg-primary" />Built for consistent progress</div>
        <h1 className="text-5xl font-bold leading-[.98] sm:text-6xl lg:text-7xl">Turn spare minutes into <span className="text-primary">real skills.</span></h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Short daily plans that fit your life. Choose a skill, focus for 10–20 minutes, and build momentum you can see.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild variant="forge" size="xl"><Link to="/dashboard">Start learning <ArrowRight /></Link></Button><div className="flex items-center gap-2 px-2 text-sm text-muted-foreground"><Check className="size-4 text-primary" />No account required</div></div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground"><span><strong className="font-display text-xl text-foreground">15 min</strong> daily</span><span><strong className="font-display text-xl text-foreground">4</strong> skill paths</span><span><strong className="font-display text-xl text-foreground">∞</strong> potential</span></div>
      </div>
      <div className="relative mx-auto w-full max-w-lg">
        <div className="rounded-lg border border-border bg-card p-4 shadow-2xl shadow-primary/5 sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-4"><div><p className="text-xs font-bold uppercase text-primary">Today's focus</p><h2 className="mt-1 text-xl font-semibold">Python foundations</h2></div><div className="grid size-12 place-items-center rounded-md bg-accent text-accent-foreground"><Target /></div></div>
          <div className="py-6"><div className="mb-3 flex justify-between text-sm"><span className="text-muted-foreground">Daily progress</span><b>2 / 3</b></div><div className="h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full w-2/3 rounded-full bg-primary" /></div></div>
          {[['Read','Functions & arguments','5 min'],['Practice','Build a calculator','10 min'],['Reflect','Write one takeaway','2 min']].map(([tag,title,time],i)=><div key={title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-t border-border py-4"><span className={`grid size-7 place-items-center rounded-full border text-xs font-bold ${i<2?'border-primary bg-primary text-primary-foreground':'border-border text-muted-foreground'}`}>{i<2?<Check className="size-4"/>:i+1}</span><div className="min-w-0"><p className="text-xs text-muted-foreground">{tag}</p><p className="truncate text-sm font-semibold">{title}</p></div><span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" />{time}</span></div>)}
        </div>
        <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-md border border-border bg-surface-raised px-4 py-3 shadow-xl sm:-left-8"><Flame className="text-primary" /><div><p className="text-xs text-muted-foreground">Current streak</p><p className="font-display font-bold">12 days</p></div></div>
      </div>
    </section>
  </main>
}