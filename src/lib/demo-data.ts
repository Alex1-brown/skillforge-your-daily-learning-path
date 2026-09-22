import { Bot, Braces, Code2, Languages, type LucideIcon } from "lucide-react";

export type Skill = { id: string; name: string; description: string; level: string; progress: number; lessons: number; Icon: LucideIcon };
export const skills: Skill[] = [
  { id: "english", name: "English", description: "Speak and write with confidence", level: "Intermediate", progress: 64, lessons: 38, Icon: Languages },
  { id: "python", name: "Python", description: "Build useful programs from scratch", level: "Beginner", progress: 42, lessons: 24, Icon: Braces },
  { id: "ai", name: "AI", description: "Understand and apply modern AI", level: "Beginner", progress: 28, lessons: 18, Icon: Bot },
  { id: "programming", name: "Programming", description: "Master core coding concepts", level: "Intermediate", progress: 51, lessons: 32, Icon: Code2 },
];
export const dailySteps = [
  { id: "concept", type: "LEARN", title: "Functions and arguments", text: "Understand how functions package reusable logic and receive input values.", minutes: 5 },
  { id: "practice", type: "PRACTICE", title: "Build a tip calculator", text: "Write a function that accepts a bill total and returns the final amount.", minutes: 10 },
  { id: "reflect", type: "REFLECT", title: "Capture the insight", text: "Write one sentence explaining when a function is useful.", minutes: 2 },
];
export const week = [{d:'M',v:12},{d:'T',v:18},{d:'W',v:15},{d:'T',v:20},{d:'F',v:10},{d:'S',v:17},{d:'S',v:0}];