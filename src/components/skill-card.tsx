import { ArrowUpRight } from "lucide-react";
import type { Skill } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";

export function SkillCard({ skill, active, onSelect }: { skill: Skill; active?: boolean; onSelect?: () => void }) {
  const { Icon } = skill;
  return <article className={`group rounded-md border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 ${active?'border-primary':'border-border'}`}>
    <div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-md bg-secondary text-primary"><Icon className="size-5" /></span>{active?<span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase text-accent-foreground">Active</span>:<ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}</div>
    <h3 className="mt-5 text-lg font-bold">{skill.name}</h3><p className="mt-1 min-h-10 text-sm leading-5 text-muted-foreground">{skill.description}</p>
    <div className="mt-5 flex items-center justify-between text-xs"><span className="text-muted-foreground">{skill.level}</span><b>{skill.progress}%</b></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{width:`${skill.progress}%`}} /></div>
    {onSelect && <Button variant={active?"secondary":"outline"} className="mt-5 w-full" onClick={onSelect}>{active?'Current path':'Choose skill'}</Button>}
  </article>
}