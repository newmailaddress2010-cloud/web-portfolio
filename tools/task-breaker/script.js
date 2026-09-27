const task=document.getElementById("task"),make=document.getElementById("make"),result=document.getElementById("result"),steps=document.getElementById("steps"),tip=document.getElementById("tip"),copy=document.getElementById("copy"),again=document.getElementById("again"),historyBox=document.getElementById("historyBox"),historyList=document.getElementById("history"),clearHistory=document.getElementById("clearHistory");
let minutes=5,lastResult="";
document.querySelectorAll(".size").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".size").forEach(b=>b.classList.remove("active"));btn.classList.add("active");minutes=Number(btn.dataset.min)}));
function makeSteps(t){
 const patterns=[
  {keys:["掃除","片付け","整理"],a:["必要な場所を1か所だけ決める","目につくゴミ・不要な物を3つだけ片付ける","残りを「捨てる・戻す・保留」に分ける"],tip:"全部終わらせようとせず、最初は床や机の一部分だけで十分です。"},
  {keys:["メール","返信","連絡","LINE","ライン"],a:["返信する相手を1人だけ選ぶ","伝えたいことを3つ以内に箇条書きする","短い文章にして送信する"],tip:"完璧な文章より、「返信が届くこと」を目標にすると始めやすくなります。"},
  {keys:["勉強","学習","資格","試験"],a:["教材を1つだけ開く","今日やる範囲を1ページまたは1問に決める","タイマーをセットして始める"],tip:"「勉強する」ではなく「1問だけ解く」まで小さくすると動きやすくなります。"},
  {keys:["申告","書類","手続き","役所","確定申告"],a:["必要な書類・情報を1つ確認する","提出先と期限をメモする","次に必要な書類を1つだけ用意する"],tip:"手続きは全部調べなくても大丈夫。まず「何が必要か」を1つ確認します。"},
  {keys:["仕事","応募","求人","履歴書"],a:["候補を1件だけ選ぶ","募集条件を3つだけ確認する","応募に必要な情報を1つ準備する"],tip:"応募するかどうかは後で決めてもOK。まず情報を集めるところまでで十分です。"}
 ];
 return patterns.find(x=>x.keys.some(k=>t.includes(k)))||{a:[t+"を「準備・実行・確認」の3つに分ける","まず準備だけを"+minutes+"分以内で終わらせる","終わったら、次にやることを1つだけ決める"],tip:"「全部終わらせる」ではなく、「次の一歩を決める」ことを今日のゴールにしてみてください。"};
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function show(){const text=task.value.trim();if(!text){task.focus();return}const p=makeSteps(text);steps.innerHTML=p.a.map((s,i)=>"<li><span class=\"num\">"+(i+1)+"</span><div><div class=\"step-title\">"+escapeHtml(s)+"</div><div class=\"step-detail\">"+(i===0?"ここまでできたら十分です。":i===1?"できる範囲で進めましょう。":"終わらなくても、次の一歩が見えればOKです。")+"</div></div></li>").join("");tip.textContent=p.tip;lastResult="【先延ばし分解】\nやること："+text+"\n\n1. "+p.a[0]+"\n2. "+p.a[1]+"\n3. "+p.a[2]+"\n\n"+p.tip;result.classList.remove("hidden");saveHistory(text);result.scrollIntoView({behavior:"smooth",block:"start"})}
function saveHistory(text){let h=JSON.parse(localStorage.getItem("taskBreakerHistory")||"[]");h=[text,...h.filter(x=>x!==text)].slice(0,5);localStorage.setItem("taskBreakerHistory",JSON.stringify(h));renderHistory()}
function renderHistory(){const h=JSON.parse(localStorage.getItem("taskBreakerHistory")||"[]");historyBox.classList.toggle("hidden",h.length===0);historyList.innerHTML=h.map(x=>"<li>"+escapeHtml(x)+"</li>").join("")}
make.addEventListener("click",show);task.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")show()});
copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(lastResult);copy.textContent="コピーしました";setTimeout(()=>copy.textContent="結果をコピー",1500)}catch(e){copy.textContent="コピーできませんでした"}});
again.addEventListener("click",()=>{task.value="";result.classList.add("hidden");task.focus();window.scrollTo({top:0,behavior:"smooth"})});
clearHistory.addEventListener("click",()=>{localStorage.removeItem("taskBreakerHistory");renderHistory()});renderHistory();