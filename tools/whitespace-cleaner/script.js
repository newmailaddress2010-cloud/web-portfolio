const input=document.getElementById("input");
const output=document.getElementById("output");
const trim=document.getElementById("trim");
const spaces=document.getElementById("spaces");
const blank=document.getElementById("blank");
const removeBlank=document.getElementById("removeBlank");
const status=document.getElementById("status");

document.getElementById("convert").addEventListener("click",()=>{
  let text=input.value.replace(/\r\n/g,"\n").replace(/\r/g,"\n");
  let lines=text.split("\n");

  if(trim.checked) lines=lines.map(line=>line.trim());
  if(spaces.checked) lines=lines.map(line=>line.replace(/[ \t　]+/g," "));
  if(removeBlank.checked) lines=lines.filter(line=>line.trim()!=="");
  else if(blank.checked){
    const result=[];
    let wasBlank=false;
    for(const line of lines){
      const isBlank=line.trim()==="";
      if(isBlank && wasBlank) continue;
      result.push(line);
      wasBlank=isBlank;
    }
    lines=result;
  }

  output.value=lines.join("\n");
  status.textContent="文章を整理しました。";
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
  trim.checked=false;
  spaces.checked=false;
  blank.checked=false;
  removeBlank.checked=false;
  status.textContent="";
});