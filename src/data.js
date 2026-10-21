export const W={
 home:'ask lad fall flask salad dash glad shall flash shag hall slag gas fad sad has jag add alas',
 top:'type tower power write quiet water your true route pretty puppy report prior tire outer',
 bottom:'zoom can vim box name cabin bam mix zinc vex comb maze bunk next calm nab zen mum',
 words:'planet river bright simple garden window coffee orange silver pocket rocket thunder jungle marble puzzle ladder anchor velvet breeze canyon harbor meadow lantern'
};
export const SENT=['The quick brown fox jumps over the lazy dog.','Practice makes progress, not perfection.','A calm mind types faster than a rushed one.','Every expert was once a beginner who kept going.','Small daily habits create big results over time.'];
export const CODE=['const sum = (a, b) => a + b;','for (let i = 0; i < 10; i++) {}','if (x !== y && z) { return [x, y]; }','const user = { id: 7, name: "Ada" };','items.map(i => i * 2).filter(Boolean);'];
export const seeded=s=>{let a=[...s].reduce((h,c)=>h*31+c.charCodeAt(0)|0,7);return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const mk=(pool,n,r)=>Array.from({length:n},()=>pool[Math.floor(r()*pool.length)]).join(' ');
const all=()=>Object.values(W).join(' ').split(' ');
export const MODES=[
 {id:'custom',n:'Custom Test',i:'🎛️',d:'uses your time + text type settings',lv:1,g:(s,r)=>customText(s.content||'words',!!s.time,r)},
 {id:'daily',n:'Daily Challenge',i:'📅',d:'same text for everyone today',lv:1,g:(s,r)=>mk(all(),20,seeded(new Date().toISOString().slice(0,10)))},
 {id:'home',n:'Home Row',i:'🏠',d:'asdf jkl; basics',lv:1,g:(s,r)=>mk(W.home.split(' '),22,r)},
 {id:'top',n:'Top Row',i:'⬆️',d:'qwerty reach',lv:1,g:(s,r)=>mk(W.top.split(' '),22,r)},
 {id:'bottom',n:'Bottom Row',i:'⬇️',d:'zxcv bnm reach',lv:2,g:(s,r)=>mk(W.bottom.split(' '),22,r)},
 {id:'words',n:'Word Rush',i:'🚀',d:'everyday vocabulary',lv:2,g:(s,r)=>mk(W.words.split(' '),20,r)},
 {id:'nums',n:'Number Cruncher',i:'🔢',d:'digits and symbols',lv:3,g:(s,r)=>Array.from({length:12},()=>Math.floor(r()*9000+100)+[' + ',' - ',' * ',' = ',' / '][Math.floor(r()*5)]).join('').trim()},
 {id:'sent',n:'Story Mode',i:'📖',d:'real sentences',lv:3,g:(s,r)=>SENT.slice().sort(()=>r()-.5).slice(0,2).join(' ')},
 {id:'code',n:'Code Ninja',i:'🥷',d:'brackets and operators',lv:4,g:(s,r)=>CODE.slice().sort(()=>r()-.5).slice(0,2).join(' ')},
 {id:'boss',n:'Boss Fight',i:'🐲',d:'defeat the dragon before it burns you',lv:2,boss:true,g:(s,r)=>mk(all(),24,r)},
 {id:'weak',n:'Weak-Key Forge',i:'🔥',d:'built from your mistakes',lv:1,g:(s,r)=>{
  const ks=Object.entries(s.keys||{}).filter(([k,v])=>k!==' '&&v.n>2).sort((a,b)=>b[1].miss/b[1].n-a[1].miss/a[1].n).slice(0,4).map(e=>e[0]);
  if(!ks.length)return mk(all(),20,r);
  const hit=all().filter(w=>ks.some(k=>w.includes(k)));const base=hit.length?hit:ks.map(k=>k+k);
  return Array.from({length:18},(_,i)=>i%3==2?ks.map(()=>ks[Math.floor(r()*ks.length)]).join(''):base[Math.floor(r()*base.length)]).join(' ')}}
];
export const BADGES=[
 {id:'first',i:'🐣',n:'First Flight',t:'Finish a run',f:r=>true},
 {id:'speed',i:'⚡',n:'Speedster',t:'40+ WPM',f:r=>r.wpm>=40},
 {id:'fast',i:'🚀',n:'Rocket',t:'70+ WPM',f:r=>r.wpm>=70},
 {id:'sharp',i:'🎯',n:'Sharpshooter',t:'98%+ accuracy',f:r=>r.acc>=98},
 {id:'combo',i:'🔥',n:'Combo King',t:'60 combo',f:r=>r.combo>=60},
 {id:'steady',i:'🧘',n:'Zen Typist',t:'90%+ consistency',f:r=>r.cons>=90},
 {id:'slayer',i:'🐲',n:'Dragon Slayer',t:'Win a boss fight',f:r=>r.won===true}
];
export const SKINS=['light','neon','forest','sunset'];
export const PETS=['🥚','🐣','🐥','🦜','🦅','🐉'];
export const petFor=l=>PETS[Math.min(5,Math.floor((l-1)/2))];
export const lvl=xp=>Math.floor(Math.sqrt(xp/80))+1;
export const lvBase=l=>(l-1)*(l-1)*80;
export const today=()=>new Date().toISOString().slice(0,10);

export const PARAS=[
 'Typing is a skill that grows with steady practice. Keep your wrists relaxed, your eyes on the screen, and let your fingers find their home on the middle row. Speed will come naturally once accuracy becomes a habit.',
 'Every morning the city wakes up slowly. Shops open their shutters, buses fill with sleepy passengers, and the smell of fresh tea drifts through the narrow streets. It is a good time to sit down and practice something new.',
 'Great programmers are not always the fastest typists, but fast typing removes friction between an idea and the screen. When your hands stop being the bottleneck, your thoughts can move freely and your projects grow faster.'
];
export const customText=(kind,long,r)=>{
 const pk=a=>a[Math.floor(r()*a.length)];
 if(kind==='words')return mk(Object.values(W).join(' ').split(' '),long?160:30,r);
 if(kind==='sentences')return Array.from({length:long?20:4},()=>pk(SENT)).join(' ');
 return Array.from({length:long?5:1},()=>pk(PARAS)).join(' ');
};
