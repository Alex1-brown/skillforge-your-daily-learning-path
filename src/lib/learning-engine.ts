export type QuizQuestion = { id:string; prompt:string; options:string[]; answer:number; explanation:string };
export type Lesson = { id:string; skillId:string; title:string; concept:string; minutes:number; questions:QuizQuestion[] };
export const pythonLessons: Lesson[] = [
 {id:"python-variables",skillId:"python",title:"Variables",concept:"Variables store values so your program can reuse and change information.",minutes:8,questions:[{id:"q1",prompt:"What does x = 10 do?",options:["Prints 10","Stores 10 in x","Adds 10 to x","Creates a function"],answer:1,explanation:"The assignment stores the value 10 in the variable x."}]},
 {id:"python-types",skillId:"python",title:"Data Types",concept:"Python values have types such as strings, integers, floats and booleans.",minutes:8,questions:[{id:"q1",prompt:"What type is the value 42?",options:["str","bool","int","list"],answer:2,explanation:"42 is an integer (int)."}]},
 {id:"python-conditions",skillId:"python",title:"Conditions",concept:"if statements let your program choose what to do based on a condition.",minutes:9,questions:[{id:"q1",prompt:"Which keyword starts a condition in Python?",options:["when","if","check","case"],answer:1,explanation:"Python uses the if keyword for conditional execution."}]},
 {id:"python-loops",skillId:"python",title:"Loops",concept:"Loops repeat work without writing the same code again and again.",minutes:10,questions:[{id:"q1",prompt:"Which loop is commonly used to iterate over a list?",options:["for","repeat","loop","each"],answer:0,explanation:"A for loop iterates over items in an iterable such as a list."}]},
 {id:"python-functions",skillId:"python",title:"Functions",concept:"Functions package reusable logic and can receive arguments and return values.",minutes:10,questions:[{id:"q1",prompt:"What keyword defines a function?",options:["func","define","def","function"],answer:2,explanation:"Python uses def to define a function."}]}
];
const KEY="skillforge.learning.v1";
export type LearningProgress={xp:number;completedLessons:string[];answers:number;correct:number;lastActive:string};
export function loadProgress():LearningProgress{try{return JSON.parse(localStorage.getItem(KEY)||"null")||{xp:0,completedLessons:[],answers:0,correct:0,lastActive:""}}catch{return {xp:0,completedLessons:[],answers:0,correct:0,lastActive:""}}}
export function saveProgress(p:LearningProgress){localStorage.setItem(KEY,JSON.stringify(p));}
export function isUnlocked(index:number,p:LearningProgress){return index===0||p.completedLessons.includes(pythonLessons[index-1].id)}
export function answerQuestion(p:LearningProgress,lessonId:string,correct:boolean){const next={...p,xp:p.xp+(correct?10:0),answers:p.answers+1,correct:p.correct+(correct?1:0),lastActive:new Date().toISOString()};if(correct&&!next.completedLessons.includes(lessonId))next.completedLessons=[...next.completedLessons,lessonId];saveProgress(next);return next;}
