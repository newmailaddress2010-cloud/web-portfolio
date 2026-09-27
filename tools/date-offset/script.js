const base=document.getElementById("base");
const days=document.getElementById("days");
const result=document.getElementById("result");
const todayBtn=document.getElementById("today");
const weekdays=["日","月","火","水","木","金","土"];

function pad(n){return String(n).padStart(2,"0")}
function localDateString(d){
  return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
}
function parseDate(value){
  const [y,m,day]=value.split("-").map(Number);
  return new Date(y,m-1,day);
}
function calculate(sign){
  if(!base.value){alert("基準日を入力してください。");return}
  const n=Number(days.value);
  if(!Number.isInteger(n)||n<0){alert("日数は0以上の整数で入力してください。");return}
  const d=parseDate(base.value);
  d.setDate(d.getDate()+sign*n);
  const label=sign<0?"日前":"日後";
  result.hidden=false;
  result.innerHTML='<div class="label">'+n+'日'+label+'の結果</div>'+
    '<div class="date">'+d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日</div>'+
    '<div class="weekday">（'+weekdays[d.getDay()]+'曜日）</div>';
}
document.querySelectorAll("[data-sign]").forEach(btn=>{
  btn.addEventListener("click",()=>calculate(Number(btn.dataset.sign)));
});
todayBtn.addEventListener("click",()=>{
  const now=new Date();
  base.value=localDateString(now);
});
const now=new Date();
base.value=localDateString(now);