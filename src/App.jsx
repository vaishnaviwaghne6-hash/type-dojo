import {useState,useEffect} from 'react';
import Play from './Play.jsx';import Report,{Spark} from './Report.jsx';
import {MODES,BADGES,SKINS,lvl,lvBase,petFor,today} from './data.js';
import {setMuted,beep} from './sound.js';
const KEY='typedojo.v2';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}};
export default function App(){
 const [save,setSave]=useState(()=>({xp:0,runs:0,streak:0,pb:{},hist:[],keys:{},badges:[],skin:'light',mute:false,time:0,content:'words',...load()}));
 const [scr,setScr]=useState('home'),[mode,setMode]=useState(null),[res,setRes]=useState(null),[nb,setNb]=useState([]),[prev,setPrev]=useState(null),[isPb,setIsPb]=useState(false),[runId,setRunId]=useState(0);
 const L=lvl(save.xp);
 useEffect(()=>{document.documentElement.dataset.skin=save.skin;setMuted(save.mute)},[save.skin,save.mute]);
 const commit=s=>{setSave(s);try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}};
 const done=r=>{
  const s={...save,pb:{...save.pb}};s.xp+=r.xp;s.runs++;
  setIsPb(r.wpm>(s.pb[r.mode]||0)&&s.runs>1);s.pb[r.mode]=Math.max(r.wpm,s.pb[r.mode]||0);
  const t=today();if(s.lastDay!==t){const y=new Date(Date.now()-864e5).toISOString().slice(0,10);s.streak=s.lastDay===y?s.streak+1:1;s.lastDay=t}
  const keys={...s.keys};Object.entries(r.keys).forEach(([k,v])=>{const o=keys[k]||{n:0,miss:0};keys[k]={n:o.n+v.n,miss:o.miss+v.miss}});s.keys=keys;
  const got=BADGES.filter(b=>!s.badges.includes(b.id)&&b.f(r));s.badges=[...s.badges,...got.map(b=>b.id)];
  setPrev(s.hist[s.hist.length-1]||null);s.hist=[...s.hist,{wpm:r.wpm,acc:r.acc,mode:r.mode}].slice(-30);
  commit(s);setNb(got);setRes(r);setScr('report');
 };
 if(scr==='play')return <Play key={runId} mode={mode} save={save} onDone={done} onExit={()=>setScr('home')}/>;
 if(scr==='report')return <Report res={res} prev={prev} save={save} newBadges={nb} isPb={isPb} onAgain={()=>{setRunId(x=>x+1);setScr('play')}} onHome={()=>setScr('home')}/>;
 const avg=save.hist.length?Math.round(save.hist.slice(-5).reduce((a,b)=>a+b.wpm,0)/Math.min(5,save.hist.length)):0;
 const span=lvBase(L+1)-lvBase(L);
 return <div className="wrap">
  <div className="card"><div className="row sp"><div><h1>⌨️ Type Dojo</h1><span className="mute">Train. Fight bosses. Evolve your pet.</span></div>
   <div className="row"><span className="badge">🔥 {save.streak}-day streak</span>
    <button className="g" title="Sound" onClick={()=>commit({...save,mute:!save.mute})}>{save.mute?'🔇':'🔊'}</button>
    <button className="g" title="Theme" onClick={()=>commit({...save,skin:SKINS[(SKINS.indexOf(save.skin)+1)%SKINS.length]})}>🎨 {save.skin}</button></div></div>
   <div className="row" style={{marginTop:14}}><div className="pet" title="Your pet evolves as you level up">{petFor(L)}</div>
    <div style={{flex:1,minWidth:180}}><b>Level {L}</b> <span className="mute">· {save.xp} XP · {save.runs} runs · recent avg {avg} WPM</span>
     <div className="bar" style={{marginTop:6}}><i style={{width:(save.xp-lvBase(L))/span*100+'%'}}/></div></div></div></div>
  <div className="card"><h2>⚙️ Practice settings</h2>
   <div className="mute">⏱️ Time limit (applies to every exercise)</div>
   <div className="row" style={{margin:'6px 0 12px'}}>{[[0,'No limit'],[30,'30 sec'],[60,'1 min'],[120,'2 min'],[300,'5 min']].map(([v,l])=><button key={v} className={'g chip '+(save.time===v?'on':'')} onClick={()=>commit({...save,time:v})}>{l}</button>)}</div>
   <div className="mute">📝 Text type (used in 🎛️ Custom Test)</div>
   <div className="row" style={{marginTop:6}}>{[['words','Words'],['sentences','Sentences'],['paragraph','Paragraph']].map(([v,l])=><button key={v} className={'g chip '+(save.content===v?'on':'')} onClick={()=>commit({...save,content:v})}>{l}</button>)}</div>
  </div>
  <div className="card"><h2>Choose your exercise</h2><div className="grid">
   {MODES.map(m=><button key={m.id} className="mode" disabled={L<m.lv} onClick={()=>{beep(700,.08);setMode(m);setRunId(x=>x+1);setScr('play')}}>
    <span className="ico">{L<m.lv?'🔒':m.i}</span><b>{m.n}</b><span className="mute">{L<m.lv?'Unlocks at level '+m.lv:m.d}</span>
    {save.pb[m.id]&&<div className="mute">Best: {save.pb[m.id]} WPM</div>}</button>)}</div></div>
  <div className="card"><h2>Badges</h2>{BADGES.map(b=><span key={b.id} className={'badge '+(save.badges.includes(b.id)?'':'off')}>{b.i} {b.n} <span className="mute">· {b.t}</span></span>)}</div>
  <div className="card"><h2>Progress</h2>{save.hist.length>1?<Spark data={save.hist.map(h=>h.wpm)}/>:<span className="mute">Finish two runs to see your WPM trend.</span>}</div>
 </div>;
}
