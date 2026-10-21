import {lvl,lvBase,petFor} from './data.js';
const ROWS=['qwertyuiop','asdfghjkl','zxcvbnm'];
export default function Report({res,prev,save,newBadges,isPb,onAgain,onHome}){
 const ks=Object.entries(res.keys).filter(([k])=>k.trim());
 const rate=k=>res.keys[k]?res.keys[k].miss/res.keys[k].n:0;
 const worst=ks.filter(([k,v])=>v.miss>0).sort((a,b)=>b[1].miss/b[1].n-a[1].miss/a[1].n).slice(0,4);
 const slow=ks.filter(([k,v])=>v.c>1).map(([k,v])=>[k,v.ms/v.c]).sort((a,b)=>b[1]-a[1]).slice(0,3);
 const S=[];
 if(res.won===true)S.push(['🐲','You slayed the dragon! +40 bonus XP.']);
 if(res.won===false)S.push(['💀','The dragon won this round. Reduce typos — each one costs 3 HP.']);
 if(res.acc<90)S.push(['🐢','Accuracy first: slow down ~20% until you stay above 95%.']);
 else if(res.acc>=97&&res.wpm<45)S.push(['🏁','Excellent accuracy. Push your pace by 10%.']);
 if(res.cons<70)S.push(['🥁','Your rhythm is uneven. Type to an imaginary metronome.']);
 if(worst.length)S.push(['🔥',`Trouble keys: ${worst.map(w=>w[0]===' '?'space':w[0]).join(', ')}. Run Weak-Key Forge.`]);
 if(slow.length)S.push(['⏱️',`Slowest keys: ${slow.map(s=>s[0]+' ('+Math.round(s[1])+'ms)').join(', ')}.`]);
 if(prev&&res.wpm>prev.wpm)S.push(['📈',`+${res.wpm-prev.wpm} WPM vs your previous run.`]);
 S.push(['🎓',`Next up: ${res.wpm>=50?'Code Ninja':res.acc<92?'Home Row':'Boss Fight'}.`]);
 const grade=res.wpm>=70&&res.acc>=96?'S':res.wpm>=50&&res.acc>=94?'A':res.wpm>=35&&res.acc>=90?'B':res.wpm>=20?'C':'D';
 const L=lvl(save.xp),party=grade==='S'||grade==='A'||isPb||res.won;
 return <div className="wrap">
  {party&&Array.from({length:36},(_,i)=><span key={i} className="conf" style={{left:(i*29%100)+'%',animationDelay:(i%9)*.18+'s'}}>{['🎉','✨','⭐','🎊'][i%4]}</span>)}
  <div className="card pop"><div className="row sp"><div><h1>{res.won===false?'Defeated 💀':'Run complete '+(grade==='S'?'🏆':'✨')}</h1>
   <span className="mute">+{res.xp} XP · {res.time}s · {res.chars} chars {isPb&&'· 🏅 New personal best!'}</span></div>
   <div className="stat" style={{flex:'none'}}><b style={{fontSize:52,color:'var(--acc)'}}>{grade}</b><span className="mute">Grade</span></div></div>
   <div className="row" style={{marginTop:12}}>
    <div className="stat"><b>{res.wpm}</b><span className="mute">WPM</span></div><div className="stat"><b>{res.acc}%</b><span className="mute">Accuracy</span></div>
    <div className="stat"><b>{res.cons}</b><span className="mute">Consistency</span></div><div className="stat"><b>{res.combo}</b><span className="mute">Best combo</span></div></div>
   <div style={{marginTop:12}}><div className="row sp mute"><span>{petFor(L)} Level {L}</span><span>{save.xp-lvBase(L)} / {lvBase(L+1)-lvBase(L)} XP</span></div>
    <div className="bar"><i style={{width:(save.xp-lvBase(L))/(lvBase(L+1)-lvBase(L))*100+'%'}}/></div></div>
   {newBadges.length>0&&<p>🎉 New badge: {newBadges.map(b=><span className="badge" key={b.id}>{b.i} {b.n}</span>)}</p>}
  </div>
  <div className="card"><h2>Speed over time (WPM)</h2><Spark data={res.series}/></div>
  <div className="card"><h2>Keyboard error heatmap</h2><div className="kb">{ROWS.map((row,ri)=><div className="kr" key={ri} style={{marginLeft:ri*14}}>{row.split('').map(k=>{
    const v=res.keys[k],r=rate(k);const bg=!v?'transparent':r===0?'color-mix(in srgb,var(--ok) 30%,transparent)':`color-mix(in srgb,var(--bad) ${Math.min(95,30+r*200)}%,transparent)`;
    return <div className="k" key={k} style={{background:bg}} title={v?`${v.miss} misses / ${v.n}`:'unused'}>{k}</div>})}</div>)}</div>
   <p className="mute" style={{textAlign:'center'}}>Green = clean · Red = error-prone</p></div>
  <div className="card"><h2>Coach's suggestions</h2>{S.map((s,i)=><div className="sug" key={i}>{s[0]} {s[1]}</div>)}</div>
  <div className="row"><button className="p" onClick={onAgain}>↻ Try again</button><button className="g" onClick={onHome}>Back to dojo</button></div>
 </div>;
}
export function Spark({data}){
 if(data.length<2)return null;const w=600,h=110,m=Math.max(...data,10),p=data.map((v,i)=>[i/(data.length-1)*w,h-8-v/m*(h-16)]);
 return <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:110}}><polyline fill="none" stroke="var(--acc)" strokeWidth="3" points={p.map(x=>x.join(',')).join(' ')}/>{p.map((x,i)=><circle key={i} cx={x[0]} cy={x[1]} r="3" fill="var(--acc2)"/>)}</svg>;
}
