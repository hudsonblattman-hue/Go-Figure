import {bankFor} from './questions.js';
import {dateKey,dayNumber,puzzleFor,earned,validAnswers,nextMidnight,storageKeyFor,VERSION} from './game.js';
const $=s=>document.querySelector(s),fmt=n=>n.toLocaleString('en-US',{maximumFractionDigits:3});
let key=dateKey(),puzzle=puzzleFor(bankFor(key),key),answers=[],advanced=0,storageOK=true;
const storageKey=()=>storageKeyFor(key);
function read(){try{const s=JSON.parse(localStorage.getItem(storageKey()));if(s&&validAnswers(s.answers)){answers=s.answers;advanced=Number.isInteger(s.advanced)?Math.max(0,Math.min(s.advanced,answers.length,5)):0;}else{answers=[];advanced=0;}}catch{storageOK=false;answers=[];advanced=0;}}
function save(){try{localStorage.setItem(storageKey(),JSON.stringify({answers,advanced}));}catch{storageOK=false;}}
function best(q){return Math.max(...q.options.map(o=>o.value));}
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',3000);}
function renderOption(option,index,selected,maximum){
 const unit=option.unit||'dimensionless';
 if(selected===undefined)return `<button class="option" data-choice="${index}" aria-label="${option.label}, ${unit}"><span class="label">${option.label} <span class="unit">(${unit})</span></span></button>`;
 const chosen=index===selected,highest=option.value===maximum;
 return `<div class="answer-result ${chosen?'chosen':''} ${highest?'best':''}" role="img" aria-label="${option.label}, ${unit}: ${fmt(option.value)}${chosen?', your choice':''}${highest?', highest value':''}"><div class="result-track" aria-hidden="true"><div class="result-mark" style="--width:${option.value/maximum*100}%"><span class="bar"></span><span class="result-end"><span class="value">${fmt(option.value)}</span>${chosen?'<span class="pick-marker"></span>':''}</span></div></div></div>`;
}
function renderSubject(question,selected){
 if(selected===undefined)return `<div class="photo ${question.contain?'contain':''}"><img src="assets/${question.image}" alt="${question.title}" width="800" height="800"></div><h2>${question.title}</h2><p class="subtitle">${question.subtitle}</p>`;
 const value=fmt(question.options[selected].value);
 return `<div class="points-panel" style="--point-digits:${value.length+1}" aria-label="${value} points earned this round"><span class="points-caption">POINTS EARNED</span><strong>+${value}</strong></div><h2>${question.title}</h2><p class="subtitle">${question.subtitle}</p>`;
}
function render(){
 $('#edition').textContent='DAILY FIVE';$('#date').textContent=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(key+'T12:00:00Z'));
 $('#score').textContent=fmt(earned(puzzle,answers));
 $('#round-label').textContent=advanced===5?'5 rounds complete':`Round ${advanced+1} of 5`;
 $('#progress').innerHTML=puzzle.map((q,i)=>`<span class="step ${i<answers.length?'done':i===advanced?'current':''}" aria-label="Round ${i+1}: ${i<answers.length?'answered':i===advanced?'current':'upcoming'}"></span>`).join('');
 $('#round-status').textContent=advanced===5?'Game complete':answers.length>advanced?'Your pick is marked with an arrow.':'Choose the biggest number.';
 $('#behind-numbers').hidden=true;
 $('#behind-numbers').replaceChildren();
 if(advanced===5){renderSummary();return;}
 const q=puzzle[advanced],selected=answers[advanced],revealed=selected!==undefined,max=best(q);
 const endpointSpace=Math.max(...q.options.map(option=>fmt(option.value).length))*.8+3;
 $('#play').innerHTML=`
 <div class="arena ${revealed?'revealed':''}">
  <article class="subject">${renderSubject(q,selected)}</article>
  <section class="question" aria-labelledby="question-title">
   <h3 id="question-title" class="sr-only" tabindex="-1">Round ${advanced+1}: ${q.title}</h3>
   <div class="options" role="group" aria-label="${revealed?'Statistic comparison':'Answer choices'}" style="--endpoint-space:${endpointSpace}em">${q.options.map((o,i)=>renderOption(o,i,selected,max)).join('')}</div>
  </section>
 </div>
 ${revealed?`<div class="round-footer"><p class="reveal-result" role="status">+${fmt(q.options[selected].value)} points${q.options[selected].value===max?' · Highest pick':''}</p><button class="primary" id="next">${advanced===4?'See your results':'Next round'}<span class="arrow" aria-hidden="true">→</span></button></div>`:''}`;
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>choose(+b.dataset.choice));
 if(revealed)$('#next').onclick=()=>{if(checkDay())return;readLatest();if(answers.length<=advanced)return;advanced++;save();render();if(advanced===5)$('#summary-title').focus();else{$('#question-title').focus({preventScroll:true});if(matchMedia('(max-width:760px)').matches)$('.arena').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}};
}
function readLatest(){if(!storageOK)return;try{const s=JSON.parse(localStorage.getItem(storageKey()));if(s&&validAnswers(s.answers)&&s.answers.length>answers.length){answers=s.answers;advanced=Math.min(s.advanced??advanced,answers.length,5);}}catch{storageOK=false;}}
function choose(index){if(checkDay())return;readLatest();if(answers.length>advanced){render();return;}answers.push(index);save();render();$('#next').focus({preventScroll:true});if(matchMedia('(max-width:760px)').matches)$('.points-panel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
function renderSummary(){
 const total=earned(puzzle,answers),maximum=puzzle.reduce((n,q)=>n+best(q),0),highest=answers.filter((a,i)=>puzzle[i].options[a].value===best(puzzle[i])).length;
 $('#play').innerHTML=`<section class="summary"><h2 id="summary-title" tabindex="-1">Daily game complete</h2><p class="final-score">${fmt(total)} <span>points</span></p><p>${highest} of 5 highest picks · ${fmt(maximum)} possible points</p><div class="review-list">${puzzle.map((q,i)=>`<div class="review-row"><span class="review-number">${i+1}</span><div>${q.title}<div class="review-label">${q.options[answers[i]].label}</div></div><strong>+${fmt(q.options[answers[i]].value)}</strong></div>`).join('')}</div><button class="primary" id="share">Share your score</button><textarea class="share-result" id="share-text" aria-label="Share result text" readonly></textarea><p>Next game at midnight Pacific.<br>${storageOK?'Progress saved on this browser.':'Browser storage unavailable.'}</p></section>`;
 $('#behind-numbers').innerHTML=`<h2 id="sources-title">Behind the numbers</h2>${puzzle.map((q,i)=>`<details class="source-round"><summary>${i+1}. ${q.title}</summary><dl class="answer-details">${q.options.map(option=>`<dt>${option.label}${option.unit?' ('+option.unit+')':''}</dt><dd>${fmt(option.value)}</dd>`).join('')}</dl><p>${q.note}</p>${q.sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label} ↗</a>`).join('')}<a href="${q.creditUrl}" target="_blank" rel="noopener noreferrer">Image: ${q.credit} ↗</a></details>`).join('')}`;
 $('#behind-numbers').hidden=false;
 $('#share').onclick=async()=>{const share=`Go Figure · ${key}\n${fmt(total)} points\n${answers.map((a,i)=>puzzle[i].options[a].value===best(puzzle[i])?'⬛':'⬜').join('')}\n${highest}/5 highest picks\n${location.origin}${location.pathname}`;try{await navigator.clipboard.writeText(share);toast('Score copied.');}catch{const t=$('#share-text');t.value=share;t.style.display='block';t.focus();t.select();toast('Copy the selected text to share your score.');}};
}
function openModal(content){$('#modal-content').innerHTML=content;$('#modal').showModal();}
function help(){openModal(`<h2>How to play</h2><ol><li>Pick the statistic with the <b>biggest number</b>, using the units shown. Don’t convert between units.</li><li>All four values appear as bars. The arrow marks your pick, and its value is your points: pick 90, earn 90 points.</li><li>Play five rounds. Your score is the sum of your picks. Find sources and notes at the bottom of your results.</li></ol><p>Everyone gets the same five rounds each day. A new game arrives at midnight in San Diego (Pacific time).</p><p class="modal-note">Rounded measurements are labeled “approx.” Subjects come from a rotating bank of 10. Progress and statistics are saved in this browser.</p><button class="primary" id="got-it">Let’s play</button>`);$('#got-it').onclick=()=>$('#modal').close();}
function stats(){let records=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k.startsWith(`highest:${VERSION}:`))continue;const day=k.split(':')[2];if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||k!==storageKeyFor(day))continue;const s=JSON.parse(localStorage.getItem(k));if(s&&validAnswers(s.answers)&&s.answers.length===5)records.push(day);}}catch{}records.sort();let streak=0,cursor=dayNumber(key);if(!records.includes(key))cursor--;while(records.some(k=>dayNumber(k)===cursor)){streak++;cursor--;}
 openModal(`<h2>Your statistics</h2><div class="stats-grid"><div><strong>${records.length}</strong><span>Games completed</span></div><div><strong>${streak}</strong><span>Current streak</span></div><div><strong>${answers.length}/5</strong><span>Today’s progress</span></div></div><p>Today’s score: <b>${fmt(earned(puzzle,answers))} points</b>.</p><p class="modal-note">Saved on this browser only. Daily totals have different maximums, so points are best compared with people playing the same day.</p>`);
}
function checkDay(){const next=dateKey();if(next===key)return false;key=next;puzzle=puzzleFor(bankFor(key),key);read();$('#modal').close();render();toast('A fresh daily five is ready.');return true;}
function tick(){checkDay();const sec=Math.max(0,Math.floor((nextMidnight()-Date.now())/1000));$('#countdown').textContent=[Math.floor(sec/3600),Math.floor(sec/60)%60,sec%60].map(x=>String(x).padStart(2,'0')).join(':');}
$('#help').onclick=help;$('#rules-link').onclick=help;$('#stats').onclick=stats;$('.close').onclick=()=>$('#modal').close();$('#modal').onclick=e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close();}};
window.addEventListener('storage',e=>{if(e.key===storageKey()){read();render();}});document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});read();render();tick();setInterval(tick,1000);
