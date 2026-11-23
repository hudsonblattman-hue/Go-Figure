import {bankFor} from './questions.js';
import {dateKey,dayNumber,puzzleFor,earned,validAnswers,nextMidnight,VERSION} from './game.js';
const $=s=>document.querySelector(s),fmt=n=>n.toLocaleString('en-US',{maximumFractionDigits:3});
let key=dateKey(),puzzle=puzzleFor(bankFor(key),key),answers=[],advanced=0,storageOK=true;
const storageKey=()=>`highest:${VERSION}:${key}`;
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
 if(selected===undefined)return `<div class="photo ${question.contain?'contain':''}"><img src="assets/${question.image}" alt="${question.title}" width="800" height="800"><span class="category">${question.category}</span></div><h2>${question.title}</h2><p class="subtitle">${question.subtitle}</p><a class="photo-credit" href="${question.creditUrl}" target="_blank" rel="noopener noreferrer">Image: ${question.credit} ↗</a>`;
 const value=fmt(question.options[selected].value);
 return `<div class="points-panel" style="--point-digits:${value.length+1}" aria-label="${value} points earned this round"><span class="points-caption">POINTS EARNED</span><strong>+${value}</strong></div><h2>${question.title}</h2><p class="subtitle">${question.subtitle}</p>`;
}
function render(){
 $('#edition').textContent='DAILY FIVE';$('#date').textContent=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(key+'T12:00:00Z'));
 $('#score').textContent=fmt(earned(puzzle,answers));
 $('#round-label').textContent=advanced===5?'FIVE OF FIVE':`ROUND ${advanced+1} OF 5`;
 $('#progress').innerHTML=puzzle.map((q,i)=>`<span class="step ${i<answers.length?'done':i===advanced?'current':''}" aria-label="Round ${i+1}: ${i<answers.length?'answered':i===advanced?'current':'upcoming'}"></span>`).join('');
 $('#round-status').textContent=advanced===5?'THAT’S A WRAP':answers.length>advanced?'THE NUMBERS ARE IN':'MAKE IT COUNT';
 if(advanced===5){renderSummary();return;}
 const q=puzzle[advanced],selected=answers[advanced],revealed=selected!==undefined,max=best(q);
 const endpointSpace=Math.max(...q.options.map(option=>fmt(option.value).length))*.8+3;
 $('#play').innerHTML=`
 <div class="arena ${revealed?'revealed':''}">
  <article class="subject">${renderSubject(q,selected)}</article>
  <section class="question" aria-labelledby="question-title">
   <h3 id="question-title" tabindex="-1">Round ${advanced+1}</h3>
   <p>${revealed?'Your pick is marked with an arrow.':'Choose the statistic with the biggest number.'}</p>
   <div class="options" role="group" aria-label="${revealed?'Statistic comparison':'Answer choices'}" style="--endpoint-space:${endpointSpace}em">${q.options.map((o,i)=>renderOption(o,i,selected,max)).join('')}</div>
  </section>
 </div>
 <div class="round-footer">${revealed?`<div class="reveal-result" role="status"><strong>+${fmt(q.options[selected].value)} points.</strong> ${q.options[selected].value===max?'You picked the highest!':'Every number counts.'}</div><button class="primary" id="next">${advanced===4?'See your results':'Next round'}<span class="arrow" aria-hidden="true">→</span></button>`:`<div class="hint"><span class="hint-icon" aria-hidden="true">i</span> <span>Pick the biggest <b>number</b>. Your pick = your points.</span></div><span class="hint">${storageOK?'Progress saved on this browser':'Browser storage unavailable'}</span>`}</div>
 ${revealed?`<details class="sources"><summary>Behind the numbers · sources & notes</summary><dl class="answer-details">${q.options.map(option=>`<dt>${option.label}${option.unit?' ('+option.unit+')':''}</dt><dd>${fmt(option.value)}</dd>`).join('')}</dl><p>${q.note}</p>${q.sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label} ↗</a>`).join('')}</details>`:''}`;
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>choose(+b.dataset.choice));
 if(revealed)$('#next').onclick=()=>{if(checkDay())return;readLatest();if(answers.length<=advanced)return;advanced++;save();render();if(advanced===5)$('#summary-title').focus();else{$('#question-title').focus({preventScroll:true});if(matchMedia('(max-width:760px)').matches)$('.arena').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}};
}
function readLatest(){if(!storageOK)return;try{const s=JSON.parse(localStorage.getItem(storageKey()));if(s&&validAnswers(s.answers)&&s.answers.length>answers.length){answers=s.answers;advanced=Math.min(s.advanced??advanced,answers.length,5);}}catch{storageOK=false;}}
function choose(index){if(checkDay())return;readLatest();if(answers.length>advanced){render();return;}answers.push(index);save();render();$('#next').focus({preventScroll:true});if(matchMedia('(max-width:760px)').matches)$('.points-panel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
function renderSummary(){
 const total=earned(puzzle,answers),maximum=puzzle.reduce((n,q)=>n+best(q),0),highest=answers.filter((a,i)=>puzzle[i].options[a].value===best(puzzle[i])).length;
 $('#play').innerHTML=`<section class="summary"><div class="eyebrow">✓ DAILY FIVE COMPLETE</div><h2 id="summary-title" tabindex="-1">A little wiser. A number bigger.</h2><div class="final-score">${fmt(total)}<span style="font-size:20px;letter-spacing:0"> pts</span></div><p>${highest} of 5 highest picks · ${fmt(Number(maximum.toFixed(3)))} possible points today</p><div class="review-list">${puzzle.map((q,i)=>`<div class="review-row"><span class="${q.options[answers[i]].value===best(q)?'round-best':''}">${q.options[answers[i]].value===best(q)?'↑':'·'}</span><div>${q.title}<div class="review-label">${q.options[answers[i]].label}</div></div><strong>+${fmt(q.options[answers[i]].value)}</strong></div>`).join('')}</div><button class="primary" id="share">Share your score <span class="arrow" aria-hidden="true">↗</span></button><textarea class="share-result" id="share-text" aria-label="Share result text" readonly></textarea><p>Your next five arrive at midnight Pacific.<br>Progress is saved on this browser.</p><details class="sources" style="text-align:left;padding:15px"><summary>Review today’s answers & sources</summary>${puzzle.map(q=>`<p><b>${q.title}</b><br>${q.options.map(o=>`${o.label}: ${fmt(o.value)} ${o.unit}`).join(' · ')}<br>${q.note}</p>${q.sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label} ↗</a>`).join('')}`).join('')}</details></section>`;
 $('#share').onclick=async()=>{const share=`Go Figure · ${key}\n${fmt(total)} points\n${answers.map((a,i)=>puzzle[i].options[a].value===best(puzzle[i])?'🟩':'🟧').join('')}\n${highest}/5 highest picks\n${location.origin}${location.pathname}`;try{await navigator.clipboard.writeText(share);toast('Score copied. Make someone curious.');}catch{const t=$('#share-text');t.value=share;t.style.display='block';t.focus();t.select();toast('Copy the selected text to share your score.');}};
}
function openModal(content){$('#modal-content').innerHTML=content;$('#modal').showModal();}
function help(){openModal(`<div class="eyebrow" style="justify-content:flex-start;margin-bottom:14px">THE BIG IDEA</div><h2>Think bigger.</h2><p>Five subjects, from the everyday to the unexpected. Each has four statistics with the numbers hidden.</p><ol><li>Choose the statistic you think has the <b>largest numerical value</b>, using the units shown.</li><li>Reveal all four numbers and their comparison bars. Your choice earns its value in points—even if another option was higher.</li><li>Play all five rounds. Your total is the sum of your five choices.</li></ol><div class="example">Pick a stat worth <b>90</b>? Earn <b>90 points</b>.<br>A stat worth <b>435</b> would earn <b>435 points</b>.</div><p class="modal-note">Compare the numbers as written; don’t convert between units. Everyone gets the same five each day, resetting at midnight in San Diego (Pacific time). This version uses a rotating bank of 10 sourced subjects, so subjects repeat. Progress and statistics stay in this browser; they aren’t synced across devices.</p><button class="primary" id="got-it">Got it. Let’s play →</button>`);$('#got-it').onclick=()=>$('#modal').close();}
function stats(){let records=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k.startsWith(`highest:${VERSION}:`))continue;const s=JSON.parse(localStorage.getItem(k));if(s&&validAnswers(s.answers)&&s.answers.length===5)records.push(k.split(':').at(-1));}}catch{}records.sort();let streak=0,cursor=dayNumber(key);if(!records.includes(key))cursor--;while(records.some(k=>dayNumber(k)===cursor)){streak++;cursor--;}
 openModal(`<h2>Your daily numbers.</h2><div class="stats-grid"><div><strong>${records.length}</strong><span>Games completed</span></div><div><strong>${streak}</strong><span>Current streak</span></div><div><strong>${answers.length}/5</strong><span>Today’s progress</span></div></div><p>Today’s score: <b>${fmt(earned(puzzle,answers))} points</b>.</p><p class="modal-note">Saved on this browser only. Daily totals have different maximums, so points are best compared with people playing the same day.</p>`);
}
function checkDay(){const next=dateKey();if(next===key)return false;key=next;puzzle=puzzleFor(bankFor(key),key);read();$('#modal').close();render();toast('A fresh daily five is ready.');return true;}
function tick(){checkDay();const sec=Math.max(0,Math.floor((nextMidnight()-Date.now())/1000));$('#countdown').textContent=[Math.floor(sec/3600),Math.floor(sec/60)%60,sec%60].map(x=>String(x).padStart(2,'0')).join(':');}
$('#help').onclick=help;$('#rules-link').onclick=help;$('#stats').onclick=stats;$('.close').onclick=()=>$('#modal').close();$('#modal').onclick=e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close();}};
window.addEventListener('storage',e=>{if(e.key===storageKey()){read();render();}});document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});read();render();tick();setInterval(tick,1000);
