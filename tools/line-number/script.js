const input=document.getElementById("input");
const output=document.getElementById("output");
const start=document.getElementById("start");
const blank=document.getElementById("blank");
const status=document.getElementById("status");

document.getElementById("convert").addEventListener("click",()=>{
  let number=Number(start.value);
  if(!Number.isFinite(number)) number=1;
  const lines=input.value.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
  output.value=lines.map(line=>{
    if(!blank.checked && line.trim()==="") return line;
    const result=String(number)+": "+line;
    number++;
    return result;
  }).join("\n");
  status.textContent="行番号を追加しました。";
});

document.getElementById("copy").addEventListener("click",async()=>{
  if(!output.value){status.textContent="コピーする結果がありません。";return}
  try{await navigator.clipboard.writeText(output.value)}
  catch{output.select();document.execCommand("copy")}
  status.textContent="結果をコピーしました。";
});

document.getElementById("clear").addEventListener("click",()=>{
  input.value="";
  output.value="";
  start.value="1";
  status.textContent="";
});

input.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==="Enter") document.getElementById("convert").click();
});