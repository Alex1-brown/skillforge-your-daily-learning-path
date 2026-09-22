import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SkillCard } from "@/components/skill-card";
import { skills } from "@/lib/demo-data";
import { useDemoProgress } from "@/hooks/use-demo-progress";
export const Route=createFileRoute('/skills')({head:()=>({meta:[{title:'Skills — SkillForge'},{name:'description',content:'Choose your next learning path.'},{property:'og:title',content:'Skills — SkillForge'},{property:'og:description',content:'Choose your next learning path.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Skills});
function Skills(){const {activeSkill,setActiveSkill}=useDemoProgress();return <AppShell title="Choose your craft" eyebrow="Skill library"><p className="max-w-2xl text-sm leading-6 text-muted-foreground">Focus on one path at a time or explore the full library. Your daily plan adapts to the skill you choose.</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{skills.map(s=><SkillCard key={s.id} skill={s} active={s.id===activeSkill} onSelect={()=>setActiveSkill(s.id)}/>)}</div></AppShell>}