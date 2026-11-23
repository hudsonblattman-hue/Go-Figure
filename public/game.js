export const ZONE = 'America/Los_Angeles';
export const VERSION = 'v1';
export const CONTENT_UPDATE_DAY = '2026-11-22';
export function storageKeyFor(key) {
  return `highest:${VERSION}:${key}${key===CONTENT_UPDATE_DAY?':balanced':''}`;
}
export function dateKey(now = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone: ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(x=>[x.type,x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}
export function dayNumber(key) { return Math.floor(Date.parse(key+'T00:00:00Z') / 86400000); }
export function shuffled(items, seed) {
  let h=2166136261; for (const c of seed) h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;
  const a=[...items]; for(let i=a.length-1;i>0;i--){h=(Math.imul(h,1664525)+1013904223)>>>0;const j=h%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;
}
export function puzzleFor(bank, key) {
  const stable=shuffled(bank, 'highest-bank-v1'); const start=((dayNumber(key)%stable.length)+stable.length)%stable.length;
  return Array.from({length:5},(_,i)=>stable[(start+i)%stable.length]).map(q=>({...q,options:shuffled(q.options,key+q.id)}));
}
export function earned(puzzle, answers) { return Number(answers.reduce((n,a,i)=>n+(puzzle[i]?.options[a]?.value??0),0).toFixed(3)); }
export function validAnswers(value) {return Array.isArray(value)&&value.length<=5&&value.every(a=>Number.isInteger(a)&&a>=0&&a<4);}
export function nextMidnight(now=new Date()) {
  const d=new Date(dateKey(now)+'T00:00:00Z'); d.setUTCDate(d.getUTCDate()+1);const target=d.getTime(); let guess=target;
  for(let i=0;i<4;i++){
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(guess)).map(x=>[x.type,x.value]));
    const local=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);guess+=target-local;
  }return guess;
}
