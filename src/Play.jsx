import {useState,useEffect,useRef} from 'react';
import {beep,win} from './sound.js';
import Keyboard from './Keyboard.jsx';
export default function Play({mode,save,onDone,onExit}){
 const [text]=useState(()=>mode.g(save,Math.random));
 const [typed,setTyped]=useState('');const [now,setNow]=useState(0);const [shake,setShake]=useState(0);const [combo,setCombo]=useState(0);const [hp,setHp]=useState(100);const [press,setPress]=useState(null);
 const R=useRef({t:'',start:0,log:[],combo:0,max:0,done:false,hp:100,hit:0});
 const pb=(save.pb||{})[mode.id]||25;const limit=save.time||0;
 useEffect(()=>{
  const fin=won=>{
   const r=R.current;r.done=true;if(!r.log.length){onExit();return}
   const log=r.log,mins=Math.max(.01,(Date.now()-r.start)/60000);
   let good=0;for(let i=0;i<r.t.length;i++)if(r.t[i]===text[i])good++;
   const wpm=Math.round(good/5/mins),acc=Math.round(log.filter(l=>l.ok).length/log.length*1000)/10;
   const sec={};log.forEach(l=>{const s=Math.floor(l.t/1000);sec[s]=(sec[s]||0)+(l.ok?1:0)});
   const n=Math.max(...Object.keys(sec).map(Number))+1,series=Array.from({length:n},(_,i)=>(sec[i]||0)*12);
   const mean=series.reduce((a,b)=>a+b,0)/n,sd=Math.sqrt(series.reduce((a,b)=>a+(b-mean)**2,0)/n);
   const cons=Math.round(Math.max(0,100-sd/(mean||1)*60));
   const keys={};log.forEach((l,i)=>{const k=keys[l.ch]||(keys[l.ch]={n:0,miss:0,ms:0,c:0});k.n++;if(!l.ok)k.miss++;else if(i>0){k.ms+=l.t-log[i-1].t;k.c++}});
   const xp=Math.round(wpm*acc/100*2+r.max/4)+(mode.boss&&won?40:0);
   if(won!==false)win();
   onDone({mode:mode.id,wpm,acc,cons,series,keys,combo:r.max,xp,time:Math.round(mins*600)/10,chars:r.t.length,won:mode.boss?won:undefined});
  };
  const id=setInterval(()=>{
   const r=R.current;setNow(Date.now());
   if(limit&&r.start&&!r.done&&Date.now()-r.start>=limit*1000){fin(mode.boss?false:true);return}
   if(mode.boss&&r.start&&!r.done&&Date.now()-r.hit>5000){r.hit=Date.now();r.hp-=6;setHp(r.hp);beep(120,.2,'sawtooth',.08);if(r.hp<=0)fin(false)}
  },200);
  const kd=e=>{
   const r=R.current;if(r.done||e.ctrlKey||e.metaKey||e.altKey)return;
   if(e.key==='Backspace'){r.t=r.t.slice(0,-1);setTyped(r.t);return}
   if(e.key.length!==1)return;e.preventDefault();
   if(!r.start){r.start=Date.now();r.hit=r.start}
   const exp=text[r.t.length],ok=e.key===exp;setPress({ch:e.key,ok,n:Date.now()});r.log.push({ch:exp,ok,t:Date.now()-r.start});
   if(ok){r.combo++;r.max=Math.max(r.max,r.combo);beep(500+Math.min(r.combo,40)*12,.04)}
   else{r.combo=0;setShake(s=>s+1);beep(150,.12,'sawtooth',.06);if(mode.boss){r.hp-=3;setHp(r.hp);if(r.hp<=0){setCombo(0);r.t+=e.key;setTyped(r.t);fin(false);return}}}
   setCombo(r.combo);r.t+=e.key;setTyped(r.t);
   if(r.t.length>=text.length)fin(true);
  };
  window.addEventListener('keydown',kd);
  return()=>{clearInterval(id);window.removeEventListener('keydown',kd)};
 },[]);
 const r=R.current,el=r.start?(now-r.start)/60000:0;
 let good=0;for(let i=0;i<typed.length;i++)if(typed[i]===text[i])good++;
 const wpm=el>.02?Math.round(good/5/el):0;
 const acc=r.log.length?Math.round(r.log.filter(l=>l.ok).length/r.log.length*100):100;
 const ghost=r.start?Math.min(1,(now-r.start)/60000*pb*5/text.length):0,me=typed.length/text.length;
 const bossHp=Math.max(0,100-me*100);
 return <div className="wrap">
  <div className="row sp" style={{marginBottom:10}}><h2>{mode.i} {mode.n}</h2><button className="g" onClick={onExit}>✕ Quit</button></div>
  <div className="card">
   {mode.boss?<div style={{marginBottom:12}}>
     <div className="row sp"><span>🐲 Dragon</span><span className="mute">{Math.round(bossHp)}%</span></div><div className="bar boss"><i style={{width:bossHp+'%'}}/></div>
     <div className="row sp" style={{marginTop:8}}><span>🧙 You</span><span className="mute">{Math.max(0,Math.round(hp))} HP · dragon breathes fire every 5s, typos hurt!</span></div><div className="bar"><i style={{width:Math.max(0,hp)+'%'}}/></div>
    </div>
   :<div className="track"><div className="racer" style={{left:`calc(${me*100}% - ${me*30}px)`}}>🏎️</div><div className="racer ghost" style={{left:`calc(${ghost*100}% - ${ghost*30}px)`}}>👻</div></div>}
   <div className="row" style={{marginBottom:10}}>
    <div className="stat"><b>{wpm}</b><span className="mute">WPM</span></div>
    <div className="stat"><b>{limit?Math.max(0,Math.ceil(limit-el*60)):Math.floor(el*60)}</b><span className="mute">{limit?"Seconds left":"Seconds"}</span></div>
    <div className="stat"><b>{acc}%</b><span className="mute">Accuracy</span></div>
    <div className="stat"><b className="combo">{combo>=5?'🔥':''}{combo}</b><span className="mute">Combo</span></div>
   </div>
   <div className={'text '+(shake?'shake':'')} key={shake}>
    {text.split('').map((ch,i)=>{const c=i<typed.length?(typed[i]===ch?'c':'w'):i===typed.length?'cur':'';return <span key={i} className={c}>{ch===' '&&c==='w'?'␣':ch}</span>})}
   </div>
   <Keyboard next={typed.length<text.length?text[typed.length]:null} press={press}/>
   {!r.start&&<p className="mute">Start typing — the clock begins on your first key. Backspace fixes mistakes.</p>}
  </div></div>;
}
