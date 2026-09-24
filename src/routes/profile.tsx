import { createFileRoute } from "@tanstack/react-router";
import { Bell, CalendarDays, ChevronRight, Clock3, Globe2, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { exportProgress, loadProgress } from "@/lib/learning-engine";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Profile — SkillForge" },
    { name: "description", content: "Manage your SkillForge learning preferences." },
  ]}),
  component: Profile,
});

const prefs: Array<[LucideIcon, string, string]> = [
  [Clock3, "Daily duration", "15 minutes"], [CalendarDays, "Weekly goal", "5 sessions"],
  [Bell, "Reminders", "8:00 AM"], [Globe2, "Language", "English"],
];

const PROFILE_KEY = "skillforge.profile.v1";

function Profile() {
  const [name, setName] = useState("Alex Bruno");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [p] = useState(() => loadProgress());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) { const data = JSON.parse(saved); if (data.name) { setName(data.name); setDraft(data.name); } }
    } catch {}
  }, []);

  const save = () => {
    const clean = draft.trim() || "Alex Bruno";
    setName(clean); setDraft(clean); setEditing(false);
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: clean }));
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportProgress(p)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "skillforge-progress.json"; a.click(); URL.revokeObjectURL(url);
  };

  return <AppShell title="Your profile" eyebrow="Personal settings">
    <div className="grid gap-6 lg:grid-cols-[.65fr_1.35fr]">
      <aside className="rounded-md border border-border bg-card p-6 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground">
          {name.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        {editing ? <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
          className="mt-4 w-full rounded-md border border-border bg-background p-2 text-center font-bold outline-none focus:border-primary" /> :
          <h2 className="mt-4 text-xl font-bold">{name}</h2>}
        <p className="mt-1 text-sm text-muted-foreground">Your learning profile</p>
        <div className="mt-6 grid grid-cols-2 border-t border-border pt-5">
          <div><p className="font-display text-xl font-bold">{p.completedLessons.length}</p><p className="text-xs text-muted-foreground">Lessons</p></div>
          <div className="border-l border-border"><p className="font-display text-xl font-bold">{p.xp}</p><p className="text-xs text-muted-foreground">XP</p></div>
        </div>
        {editing ? <div className="mt-6 grid grid-cols-2 gap-2"><Button variant="forge" onClick={save}>Save</Button><Button variant="outline" onClick={() => { setDraft(name); setEditing(false); }}>Cancel</Button></div>
          : <Button variant="outline" className="mt-6 w-full" onClick={() => setEditing(true)}>Edit profile</Button>}
        <Button variant="outline" className="mt-2 w-full" onClick={download}>Export progress</Button>
      </aside>
      <section>
        <div className="rounded-md border border-border bg-card">
          <div className="border-b border-border p-5"><p className="text-xs font-bold uppercase text-primary">Learning preferences</p><h2 className="mt-1 text-xl font-bold">Make the routine yours</h2></div>
          {prefs.map(([Icon, label, value]) => <button key={label} className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-border p-4 text-left last:border-0 hover:bg-secondary/50">
            <span className="grid size-9 place-items-center rounded-md bg-secondary text-primary"><Icon className="size-4" /></span>
            <span className="min-w-0 truncate text-sm font-semibold">{label}</span><span className="text-xs text-muted-foreground">{value}</span><ChevronRight className="size-4 text-muted-foreground" />
          </button>)}
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-md border border-border bg-card p-5"><ShieldCheck className="mt-0.5 size-5 text-primary" /><div><p className="text-sm font-bold">Your progress stays on this device</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Learning progress is stored locally. Export it any time as a backup.</p></div></div>
      </section>
    </div>
  </AppShell>;
}