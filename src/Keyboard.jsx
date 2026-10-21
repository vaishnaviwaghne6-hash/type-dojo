const ROWS=[
 ['`~','1!','2@','3#','4$','5%','6^','7&','8*','9(','0)','-_','=+'],
 ['q','w','e','r','t','y','u','i','o','p','[{',']}','\\|'],
 ['a','s','d','f','g','h','j','k','l',';:',"'\""],
 ['SHIFT','z','x','c','v','b','n','m',',<','.>','/?']
];
const OFFSET=[0,22,34,0];
const FING=[['`1qaz~!',340],['2wsx@',20],['3edc#',50],['4rfv5tgb$%',170],['6yhn7ujm^&',170],['8ik,*<',50],['9ol.(>',20],['0p;/-=[]\'\\)_+{}|:"?',340]];
const hue=k=>{const s=k[0];const f=FING.find(([g])=>g.includes(s)||g.includes(k[1]||'~~'));return f?f[1]:260};
const shifted=c=>c.length===1&&(c!==c.toLowerCase()||'~!@#$%^&*()_+{}|:"<>?'.includes(c));
const match=(k,c)=>k.length===1?k===c.toLowerCase():k[0]===c||k[1]===c;
export default function Keyboard({next,press}){
 const needShift=next&&shifted(next);
 const pc=press&&press.ch;
 const label=k=>k.length===1?k.toUpperCase():k==='SHIFT'?'⇧':k[0]===k[1]?k[0]:<>{k[1]}<small>{k[0]}</small></>;
 return <div className="vkb">
  {ROWS.map((row,ri)=><div className="vr" key={ri} style={{marginLeft:OFFSET[ri]}}>
   {row.map(k=>{
    const isShift=k==='SHIFT';
    const target=isShift?needShift:(next!=null&&match(k,next));
    const hit=!isShift&&pc&&match(k,pc);
    const cls='vk'+(isShift?' wide':'')+(target?' target':'')+(hit?(press.ok?' hit':' miss'):'');
    return <div key={k+(hit?press.n:'')} className={cls} style={{borderBottomColor:`hsl(${isShift?260:hue(k)} 80% 55%)`}}>{label(k)}</div>})}
  </div>)}
  <div className="vr"><div key={'sp'+(pc===' '?press.n:'')} className={'vk space'+(next===' '?' target':'')+(pc===' '?(press.ok?' hit':' miss'):'')} style={{borderBottomColor:'hsl(260 80% 55%)'}}>space</div></div>
 </div>;
}
