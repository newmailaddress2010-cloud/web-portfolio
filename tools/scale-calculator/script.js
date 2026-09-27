const widthEl=document.getElementById("width");
const heightEl=document.getElementById("height");
const rateEl=document.getElementById("rate");
const result=document.getElementById("result");
const newWidth=document.getElementById("newWidth");
const newHeight=document.getElementById("newHeight");
const summary=document.getElementById("summary");

function formatNumber(n){
  return Number(n.toFixed(4)).toLocaleString("ja-JP",{maximumFractionDigits:4});
}
function calculate(){
  const w=Number(widthEl.value), h=Number(heightEl.value), r=Number(rateEl.value);
  if(!(w>0)||!(h>0)||!(r>0)){
    alert("幅・高さ・倍率を正しく入力してください。");
    return;
  }
  const nw=w*r/100, nh=h*r/100;
  newWidth.textContent=formatNumber(nw);
  newHeight.textContent=formatNumber(nh);
  summary.textContent=`元のサイズ ${formatNumber(w)} × ${formatNumber(h)} → ${formatNumber(nw)} × ${formatNumber(nh)}（${formatNumber(r)}%）`;
  result.classList.remove("hidden");
}
document.getElementById("calc").addEventListener("click",calculate);
document.querySelectorAll("[data-rate]").forEach(btn=>{
  btn.addEventListener("click",()=>{rateEl.value=btn.dataset.rate*100;calculate();});
});
document.getElementById("copy").addEventListener("click",async()=>{
  const text=summary.textContent;
  try{
    await navigator.clipboard.writeText(text);
    document.getElementById("copy").textContent="コピーしました";
    setTimeout(()=>document.getElementById("copy").textContent="結果をコピー",1200);
  }catch(e){alert(text);}
});
[widthEl,heightEl,rateEl].forEach(el=>el.addEventListener("keydown",e=>{if(e.key==="Enter")calculate();}));
