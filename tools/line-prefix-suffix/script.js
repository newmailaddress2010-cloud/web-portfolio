const input=document.getElementById("input");
const output=document.getElementById("output");
const prefix=document.getElementById("prefix");
const suffix=document.getElementById("suffix");
const blank=document.getElementById("blank");
const status=document.getElementById("status");

document.getElementById("convert").addEventListener("click",()=>{
  const lines=input.value.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
  output.value=lines.map(line=>{
    if(!blank.checked && line.trim()==="") return line;
    return prefix.value+line+suffix.value;
  }).join("\n");
  status.textContent=lines.length+"行を変換しました。";
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
  prefix.value="";
  suffix.value="";
  status.textContent="";
});

input.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==="Enter") document.getElementById("convert").click();
});