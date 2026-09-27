const input=document.getElementById("inputText");
const output=document.getElementById("outputText");
const sortMode=document.getElementById("sortMode");
const dedupe=document.getElementById("dedupe");
const removeBlank=document.getElementById("removeBlank");
const status=document.getElementById("status");

document.getElementById("run").addEventListener("click",()=>{
  let lines=input.value.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
  if(removeBlank.checked) lines=lines.filter(line=>line.trim()!=="");

  if(dedupe.checked){
    const seen=new Set();
    lines=lines.filter(line=>{
      const key=line;
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  switch(sortMode.value){
    case "asc":
      lines.sort((a,b)=>a.localeCompare(b,"ja",{numeric:true,sensitivity:"base"}));
      break;
    case "desc":
      lines.sort((a,b)=>b.localeCompare(a,"ja",{numeric:true,sensitivity:"base"}));
      break;
    case "reverse":
      lines.reverse();
      break;
    case "shuffle":
      for(let i=lines.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [lines[i],lines[j]]=[lines[j],lines[i]];
      }
      break;
  }

  output.value=lines.join("\n");
  status.textContent=lines.length+"行";
});

document.getElementById("copy").addEventListener("click",async()=>{
  if(!output.value){status.textContent="コピーする結果がありません。";return}
  try{
    await navigator.clipboard.writeText(output.value);
    status.textContent="結果をコピーしました。";
  }catch{
    output.select();
    document.execCommand("copy");
    status.textContent="結果をコピーしました。";
  }
});

document.getElementById("clear").addEventListener("click",()=>{
  input.value="";
  output.value="";
  status.textContent="";
});

input.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==="Enter") document.getElementById("run").click();
});