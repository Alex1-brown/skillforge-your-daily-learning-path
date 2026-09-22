import { useEffect, useState } from "react";

export function useDemoProgress() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeSkill, setActiveSkillState] = useState("python");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      setCompleted(JSON.parse(localStorage.getItem("skillforge-completed") ?? "[]"));
      setActiveSkillState(localStorage.getItem("skillforge-skill") ?? "python");
    } finally { setHydrated(true); }
  }, []);
  const toggle = (id: string) => setCompleted(prev => {
    const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
    localStorage.setItem("skillforge-completed", JSON.stringify(next));
    return next;
  });
  const setActiveSkill = (id: string) => { setActiveSkillState(id); localStorage.setItem("skillforge-skill", id); };
  return { completed, activeSkill, hydrated, toggle, setActiveSkill };
}