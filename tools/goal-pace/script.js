const goal=document.getElementById("goal");
const current=document.getElementById("current");
const days=document.getElementById("days");
const result=document.getElementById("result");
const remaining=document.getElementById("remaining");
const perDay=document.getElementById("perDay");
const rate=document.getElementById("rate");
const summary=document.getElementById("summary");

function fmt(n){
  return Number(n.toFixed(4)).toLocaleString("ja-JP",{maximumFractionDigits:4});
}
function calculate(){
  const g=Number(goal.value), c=Number(current.value), d=Number(days.value);
  if(!(g>0)||c<0||!(d>0)||c>g){
    alert("目標値・現在値・残り日数を正しく入力してください。現在値は目標値以下にしてください。");
    return;
  }
  const rem=g-c;
  const daily=rem/d;
  const percent=c/g*100;
  remaining.textContent=fmt(rem);
  perDay.textContent=fmt(daily);
  rate.textContent=fmt(percent)+"%";
  summary.textContent=`目標 ${fmt(g)} に対して現在 ${fmt(c)}。残り ${fmt(d)} 日なら、1日あたり ${fmt(daily)} ずつ進める必要があります。`;
  result.classList.remove("hidden");
}
document.getElementById("calc").addEventListener("click",calculate);
document.getElementById("copy").addEventListener("click",async()=>{
  try{
    await navigator.clipboard.writeText(summary.textContent);
    const b=document.getElementById("copy");
    b.textContent="コピーしました";
    setTimeout(()=>b.textContent="結果をコピー",1200);
  }catch(e){alert(summary.textContent);}
});
[goal,current,days].forEach(el=>el.addEventListener("keydown",e=>{if(e.key==="Enter")calculate();}));
