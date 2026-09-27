const text=document.getElementById("text");
const target=document.getElementById("target");
const speed=document.getElementById("speed");
const checkBtn=document.getElementById("checkBtn");
const resultCard=document.getElementById("resultCard");
const count=document.getElementById("count");
const time=document.getElementById("time");
const status=document.getElementById("status");
const detail=document.getElementById("detail");
const meterBar=document.getElementById("meterBar");

function formatTime(seconds){
 const s=Math.round(seconds);
 const m=Math.floor(s/60);
 const sec=String(s%60).padStart(2,"0");
 return m+":"+sec;
}
function cleanText(value){
 return value.replace(/[\s]/g,"");
}
function check(){
 const chars=cleanText(text.value).length;
 const spd=Number(speed.value);
 const targetSec=Number(target.value);
 if(!chars){
   resultCard.hidden=false;
   count.textContent="0";
   time.textContent="0:00";
   status.textContent="原稿を入力してください。";
   detail.textContent="";
   meterBar.style.width="0%";
   return;
 }
 const actualSec=chars/spd*60;
 const diff=actualSec-targetSec;
 const targetChars=Math.round(targetSec/60*spd);
 count.textContent=chars.toLocaleString("ja-JP");
 time.textContent=formatTime(actualSec);
 resultCard.hidden=false;

 if(Math.abs(diff)<=5){
   status.textContent="ほぼ目標時間に収まりそうです。";
   detail.textContent="目安は約"+targetChars.toLocaleString("ja-JP")+"文字です。";
 }else if(diff<0){
   const shortChars=targetChars-chars;
   status.textContent="目標時間より短めです。";
   detail.textContent="あと約"+shortChars.toLocaleString("ja-JP")+"文字話せる余裕があります。";
 }else{
   const overChars=chars-targetChars;
   status.textContent="目標時間を超えそうです。";
   detail.textContent="約"+overChars.toLocaleString("ja-JP")+"文字分を削ると、目標時間の目安に近づきます。";
 }
 const ratio=actualSec/targetSec*100;
 meterBar.style.width=Math.min(Math.max(ratio,2),100)+"%";
 resultCard.scrollIntoView({behavior:"smooth",block:"start"});
}
checkBtn.addEventListener("click",check);
text.addEventListener("keydown",e=>{
 if((e.ctrlKey||e.metaKey)&&e.key==="Enter")check();
});
