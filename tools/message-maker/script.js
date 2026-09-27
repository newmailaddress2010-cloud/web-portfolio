const situation=document.getElementById("situation");
const relationship=document.getElementById("relationship");
const tone=document.getElementById("tone");
const reason=document.getElementById("reason");
const makeBtn=document.getElementById("makeBtn");
const resultCard=document.getElementById("resultCard");
const result=document.getElementById("result");
const copyBtn=document.getElementById("copyBtn");
const resetBtn=document.getElementById("resetBtn");
const historyCard=document.getElementById("historyCard");
const historyEl=document.getElementById("history");

const labels={
decline:"誘い・申し出を断る",request:"お願い・依頼をする",reschedule:"日程変更をお願いする",
apology:"謝る・返信が遅れた",thanks:"お礼を伝える",participation:"参加を断る",other:"その他"
};

function politeStart(t){
 if(t==="simple") return "";
 if(t==="polite") return "ご連絡ありがとうございます。";
 return "ご連絡ありがとうございます。";
}
function makeMessage(){
 const s=situation.value,r=reason.value.trim(),t=tone.value;
 let text="";
 const start=politeStart(t);
 if(s==="decline"){
   text=(start?start+"\n":"")+"せっかくお声がけいただいたのですが、"+(r||"今回は都合がつかないため")+"、今回は見送らせてください。";
   if(t!=="simple") text+="\nまた機会がありましたら、よろしくお願いします。";
 }else if(s==="request"){
   text=(start?start+"\n":"")+"恐れ入りますが、"+(r||"ご対応をお願いできますでしょうか")+"。";
   if(t==="polite") text+="\nお手数をおかけしますが、よろしくお願いいたします。";
 }else if(s==="reschedule"){
   text=(start?start+"\n":"")+"申し訳ありませんが、"+(r||"予定を変更させていただきたく")+"、日程を改めてご相談できればと思います。";
   if(t!=="simple") text+="\nご迷惑をおかけしますが、よろしくお願いします。";
 }else if(s==="apology"){
   text=(start?start+"\n":"")+"返信が遅くなってしまい、申し訳ありません。";
   if(r) text+="\n"+r+"。";
   text+=t==="polite"?"\nどうぞよろしくお願いいたします。":"\nよろしくお願いします。";
 }else if(s==="thanks"){
   text=(start?start+"\n":"")+"ありがとうございます。";
   if(r) text+="\n"+r+"。";
   if(t==="polite") text+="\n今後ともよろしくお願いいたします。";
 }else if(s==="participation"){
   text=(start?start+"\n":"")+"申し訳ありませんが、"+(r||"今回は参加を見送らせていただきます")+"。";
   if(t!=="simple") text+="\nお声がけいただき、ありがとうございました。";
 }else{
   text=(start?start+"\n":"")+(r||"ご連絡ありがとうございます。よろしくお願いします。");
 }
 result.value=text;
 resultCard.hidden=false;
 saveHistory(text);
 resultCard.scrollIntoView({behavior:"smooth",block:"start"});
}

function saveHistory(text){
 let items=JSON.parse(localStorage.getItem("messageMakerHistory")||"[]");
 items.unshift({text,date:new Date().toLocaleString("ja-JP")});
 items=items.slice(0,5);
 localStorage.setItem("messageMakerHistory",JSON.stringify(items));
 renderHistory();
}
function renderHistory(){
 const items=JSON.parse(localStorage.getItem("messageMakerHistory")||"[]");
 historyCard.hidden=!items.length;
 historyEl.innerHTML="";
 items.forEach(item=>{
   const div=document.createElement("div");
   div.className="history-item";
   div.innerHTML='<div class="history-meta">'+escapeHtml(item.date)+'</div><div class="history-text">'+escapeHtml(item.text)+'</div>';
   historyEl.appendChild(div);
 });
}
function escapeHtml(str){
 return str.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
makeBtn.addEventListener("click",makeMessage);
copyBtn.addEventListener("click",async()=>{
 try{await navigator.clipboard.writeText(result.value);copyBtn.textContent="コピーしました";setTimeout(()=>copyBtn.textContent="コピー",1400)}
 catch(e){result.select();document.execCommand("copy");copyBtn.textContent="コピーしました";setTimeout(()=>copyBtn.textContent="コピー",1400)}
});
resetBtn.addEventListener("click",()=>{
 situation.selectedIndex=0;relationship.selectedIndex=0;tone.selectedIndex=0;reason.value="";result.value="";
 resultCard.hidden=true;window.scrollTo({top:0,behavior:"smooth"});
});
reason.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")makeMessage();});
renderHistory();
