const input=document.getElementById("input");
const output=document.getElementById("output");
const mode=document.getElementById("mode");
const separator=document.getElementById("separator");
const trim=document.getElementById("trim");
const status=document.getElementById("status");

document.getElementById("convert").addEventListener("click",()=>{
  const sep=separator.value;
  if(!sep){status.textContent="区切り文字を入力してください。";return}
  let text=input.value.replace(/\r\n/g,"\n").replace(/\r/g,"\n");

  if(mode.value==="toLines"){
    let parts=text.split(sep);
    if(trim.checked) parts=parts.map(x=>x.trim());
    output.value=parts.join("\n");
  }else{
    let lines=text.split("\n");
    if(trim.checked) lines=lines.map(x=>x.trim());
    output.value=lines.join(sep);
  }
  status.textContent="変換しました。";
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
  separator.value=",";
  trim.checked=false;
  status.textContent="";
});