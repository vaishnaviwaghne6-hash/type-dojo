let ctx,muted=false;
export const setMuted=m=>{muted=m};
export function beep(f=600,d=.05,type='square',v=.04){
  if(muted)return;try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
  const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;
  o.connect(g);g.connect(ctx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+d);o.stop(ctx.currentTime+d)}catch(e){}
}
export const win=()=>[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.15,'triangle',.06),i*110));
