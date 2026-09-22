export type QuizQuestion={id:string;prompt:string;options:string[];answer:number;explanation:string};
export type Lesson={id:string;skillId:string;title:string;concept:string;minutes:number;questions:QuizQuestion[]};
export type SkillPath={id:string;title:string;description:string;lessons:Lesson[]};
import {skillPaths} from "./learning-catalog";
export {skillPaths};
export const allLessons=skillPaths.flatMap(p=>p.lessons);
const KEY="skillforge.learning.v2";
export type LearningProgress={xp:number;completedLessons:string[];answers:number;correct:number;lastActive:string;streak:number;bestStreak:number;sessionDates:string[];achievements:string[];reviewQueue:string[]};
const empty=():LearningProgress=>({xp:0,completedLessons:[],answers:0,correct:0,lastActive:"",streak:0,bestStreak:0,sessionDates:[],achievements:[],reviewQueue:[]});
export function loadProgress():LearningProgress{if(typeof window==="undefined")return empty();try{return {...empty(),...(JSON.parse(localStorage.getItem(KEY)||"null")||{})}}catch{return empty()}}
export function saveProgress(p:LearningProgress){if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(p))}
export function resetProgress(){if(typeof window!=="undefined")localStorage.removeItem(KEY);return empty()}
export function exportProgress(p:LearningProgress){return JSON.stringify({format:"skillforge-learning",version:2,exportedAt:new Date().toISOString(),progress:p},null,2)}
export function importProgress(raw:string){const data=JSON.parse(raw);if(data?.format!=="skillforge-learning"||!data.progress)throw new Error("Invalid SkillForge progress file");const p={...empty(),...data.progress};saveProgress(p);return p}
export function lessonsForSkill(id:string){return skillPaths.find(p=>p.id===id)?.lessons??[]}
export function isUnlocked(lesson:Lesson,p:LearningProgress){const a=lessonsForSkill(lesson.skillId),i=a.findIndex(x=>x.id===lesson.id);return i<=0||p.completedLessons.includes(a[i-1].id)}
const day=(d=new Date())=>d.toISOString().slice(0,10);
export function answerQuestion(p:LearningProgress,lesson:Lesson,correct:boolean){const n={...p,completedLessons:[...p.completedLessons],sessionDates:[...p.sessionDates],achievements:[...p.achievements],reviewQueue:[...p.reviewQueue]};n.answers++;if(correct){n.correct++;n.xp+=10;if(!n.completedLessons.includes(lesson.id))n.completedLessons.push(lesson.id);n.reviewQueue=n.reviewQueue.filter(id=>id!==lesson.id)}else if(!n.reviewQueue.includes(lesson.id)){n.reviewQueue.push(lesson.id)}const today=day();if(!n.sessionDates.includes(today))n.sessionDates.push(today);const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);n.streak=n.sessionDates.includes(day(yesterday))?Math.max(n.streak,1)+1:1;n.bestStreak=Math.max(n.bestStreak,n.streak);n.lastActive=new Date().toISOString();if(correct&&!n.achievements.includes("first-answer"))n.achievements.push("first-answer");if(n.completedLessons.length>=5&&!n.achievements.includes("five-lessons"))n.achievements.push("five-lessons");if(n.completedLessons.length>=allLessons.length&&!n.achievements.includes("all-lessons"))n.achievements.push("all-lessons");saveProgress(n);return n}
export const accuracy=(p:LearningProgress)=>p.answers?Math.round(p.correct/p.answers*100):0;
export function recommendedLesson(p:LearningProgress){return allLessons.find(l=>p.reviewQueue.includes(l.id)&&isUnlocked(l,p))??allLessons.find(l=>isUnlocked(l,p)&&!p.completedLessons.includes(l.id))??allLessons[0]}
