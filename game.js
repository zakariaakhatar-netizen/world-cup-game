const $=s=>document.querySelector(s),esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const COL=['#d62828','#4cc3ff','#ffd400','#1fa34a'];
function ld(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
let cfg=Object.assign({names:['Morocco','Argentina','Brazil','Senegal'],n:4,timer:20,pin:'',sound:true},ld('wc_c')),S,deck=[],cur=null,qs,tmr,left=0,run=false,bt,tt=null,ac;
const save=()=>{try{localStorage.setItem('wc_s',JSON.stringify(S));localStorage.setItem('wc_c',JSON.stringify(cfg))}catch(e){}};
const tone=(f,d,t=0,ty='sine')=>{if(!cfg.sound)return;try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime+t;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(.15,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(ac.destination);o.start(n);o.stop(n+d)}catch(e){}};
function banner(t,c){const b=$('#banner');b.textContent=t;b.style.background=c||'#111';b.className='';void b.offsetWidth;b.className='show';clearTimeout(bt);bt=setTimeout(()=>b.className='',2300)}
function confetti(){for(let i=0;i<90;i++){const d=document.createElement('i');d.className='cf';d.style.cssText=`left:${Math.random()*100}vw;background:${COL[i%4]};animation-duration:${2+Math.random()*2}s;animation-delay:${Math.random()}s`;document.body.append(d);setTimeout(()=>d.remove(),5500)}}
function newGame(){const T=sh([...Array(14).fill('g'),...Array(4).fill('t'),'r','r']);S={sc:Array(cfg.n).fill(0),cur:0,over:false,hist:null,tiles:T.map(t=>({t,d:0}))};start()}
function start(){cur=null;$('#setup').hidden=true;$('#game').hidden=false;$('#win').hidden=true;$('#qm').hidden=true;render();save()}
function render(){$('#scores').innerHTML=S.sc.map((v,i)=>`<div class="tm${i===S.cur&&!S.over?' on':''}" style="--c:${COL[i]}"><b>${esc(cfg.names[i])}</b><div class="sc">${v}</div></div>`).join('');
$('#turn').innerHTML=S.over?'🏁 Final whistle!':`⚽ <span style="color:${COL[S.cur]}">${esc(cfg.names[S.cur])}</span>: pick a ball!`;
const g=$('#grid');g.innerHTML='';S.tiles.forEach((t,i)=>{const b=document.createElement('button');b.className='tile';b.disabled=!!t.d||S.over;b.textContent=t.d===1?'✅':t.d===2?'❌':t.d==='r'?'🟥':i+1;b.onclick=()=>openTile(i);g.append(b)});$('#snd').textContent=cfg.sound?'🔊':'🔇'}
function openTile(i){if(cur!==null||S.over)return;const t=S.tiles[i];cur=i;
if(t.t==='r'){t.d='r';S.sc[S.cur]=Math.max(0,S.sc[S.cur]-5);banner(`🟥 RED CARD! ${cfg.names[S.cur]} loses 5 points!`,'#c1121f');tone(140,.5,0,'sawtooth');render();return setTimeout(endTurn,2400)}
if(!deck.length)deck=sh([...QB.keys()]);const q=QB[deck.pop()],o=sh([q.c,...q.w]);qs={q,c:o.indexOf(q.c),lock:false};
$('#tl').textContent=t.t==='t'?'🏆 TROPHY BALL: +20':'⚽ GOAL BALL: +10';$('#qt').textContent=q.q;$('#ex').textContent='';$('#nx').hidden=true;
const a=$('#ans');a.innerHTML='';o.forEach((x,k)=>{const b=document.createElement('button');b.textContent='ABCD'[k]+'. '+x;b.onclick=()=>resolve(k);a.append(b)});
$('#clk').hidden=!cfg.timer;resetT();$('#qm').hidden=false}
function showT(){$('#time').textContent='⏱ '+left}
function stopT(){clearInterval(tmr);run=false}
function resetT(){stopT();left=cfg.timer;showT()}
function startT(){if(!cfg.timer||run||left<=0||qs.lock)return;run=true;tmr=setInterval(()=>{left--;showT();if(left<=3)tone(900,.08);if(left<=0)resolve(-1)},1000)}
function resolve(k){if(qs.lock)return;qs.lock=true;stopT();const t=S.tiles[cur],ok=k===qs.c,bs=$('#ans').children;bs[qs.c].classList.add('ok');if(!ok&&k>=0)bs[k].classList.add('no');
if(ok){S.sc[S.cur]+=t.t==='t'?20:10;t.d=1;tone(600,.15);tone(800,.2,.15)}else{t.d=2;tone(140,.5,0,'sawtooth')}
$('#ex').textContent=(ok?'✅ Correct! ':k<0?'⏰ Time is up. ':'❌ Not quite. ')+qs.q.e;$('#nx').hidden=false;render();save()}
function endTurn(){cur=null;if(S.tiles.every(t=>t.d))return finish();S.cur=(S.cur+1)%cfg.n;render();save()}
function finish(){S.over=true;render();const m=Math.max(...S.sc),w=S.sc.map((v,i)=>v===m?cfg.names[i]:null).filter(Boolean);$('#wt').textContent='🏆 '+w.join(' & ').toUpperCase()+(w.length>1?' DRAW!':' WIN!');$('#win').hidden=false;confetti();[523,659,784,1047].forEach((f,i)=>tone(f,.3,i*.18));save()}
function openTP(){if(cfg.pin&&prompt('Teacher PIN')!==cfg.pin)return;if(!S)return;tt=null;$('#tp').hidden=false;const c=$('#chips');c.innerHTML='';for(let i=0;i<cfg.n;i++){const b=document.createElement('button');b.textContent=cfg.names[i];b.style.cssText=`background:${COL[i]};color:${i===0||i===3?'#fff':'#111'}`;b.onclick=()=>{tt=i;[...c.children].forEach(x=>x.classList.remove('sel'));b.classList.add('sel')};c.append(b)}
const a=$('#acts');a.innerHTML='';[['−10',-10],['−5',-5],['−3',-3],['−1',-1],['+1',1],['+3',3],['+5',5],['+10',10],['✏ Set score','set'],['⚠ Warning','warn'],['↩ Undo','undo'],['0 Reset all','reset']].forEach(([l,d])=>{const b=document.createElement('button');b.textContent=l;b.onclick=()=>pen(d);a.append(b)})}
function pen(d){if(d==='undo'){if(!S.hist)return banner('Nothing to undo','#555');S.sc=JSON.parse(S.hist);S.hist=null;render();save();return banner("Teacher's decision cancelled",'#555')}
if(d==='reset'){if(!confirm('Reset all scores to 0?'))return;S.hist=JSON.stringify(S.sc);S.sc=S.sc.map(()=>0);render();save();return banner('ALL SCORES RESET','#555')}
if(tt==null)return banner('Choose a team first','#555');const N=cfg.names[tt].toUpperCase();S.hist=JSON.stringify(S.sc);let m;
if(d==='warn')m=`TEACHER'S WARNING – ${N}, BE GOOD!`;
else if(d==='set'){const v=parseInt(prompt('New score for '+cfg.names[tt]),10);if(isNaN(v)||v<0)return;S.sc[tt]=v;m=`TEACHER'S DECISION – ${N} NOW HAS ${v} POINTS!`}
else{S.sc[tt]=Math.max(0,S.sc[tt]+d);m=d<0?`TEACHER'S DECISION – ${N} LOSES ${-d} POINT${d<-1?'S':''}!`:`TEACHER'S REWARD – ${N} GETS +${d} POINT${d>1?'S':''}!`}
$('#tp').hidden=true;banner(m,d>0?'#2fb34a':'#c1121f');tone(d>0?700:110,.5,0,d>0?'sine':'square');render();save()}
[0,1,2,3].forEach(i=>$('#n'+i).value=cfg.names[i]);$('#nt').value=cfg.n;$('#tim').value=cfg.timer;$('#pin').value=cfg.pin;if(ld('wc_s'))$('#cont').hidden=false;
$('#go').onclick=()=>{cfg.names=[0,1,2,3].map(i=>$('#n'+i).value.trim()||'Team '+(i+1));cfg.n=+$('#nt').value;cfg.timer=+$('#tim').value;cfg.pin=$('#pin').value;newGame()};
$('#cont').onclick=()=>{S=ld('wc_s');if(!S)return;cfg.n=S.sc.length;start()};
$('#nx').onclick=()=>{$('#qm').hidden=true;endTurn()};
$('#t1').onclick=startT;$('#t2').onclick=stopT;$('#t3').onclick=resetT;
$('#again').onclick=()=>{S=null;$('#win').hidden=true;$('#game').hidden=true;$('#setup').hidden=false};
$('#rs').onclick=()=>{if(S&&confirm('Restart the game?')){stopT();newGame()}};
$('#snd').onclick=()=>{cfg.sound=!cfg.sound;$('#snd').textContent=cfg.sound?'🔊':'🔇';save()};
$('#rl').onclick=()=>$('#rules').hidden=false;$('#rc').onclick=()=>$('#rules').hidden=true;$('#tpb').onclick=openTP;$('#tp2').onclick=openTP;$('#tc').onclick=()=>$('#tp').hidden=true;
