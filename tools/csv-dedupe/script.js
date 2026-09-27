const input=document.getElementById("input");
const header=document.getElementById("header");
const ignoreSpace=document.getElementById("ignoreSpace");
const output=document.getElementById("output");
const stats=document.getElementById("stats");

function parseCSV(text){
  const rows=[];let row=[],cell="",quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(ch==='"'){
      if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted;
    }else if(ch===","&&!quoted){row.push(cell);cell="";}
    else if((ch==="\n"||ch==="\r")&&!quoted){
      if(ch==="\r"&&text[i+1]==="\n")i++;
      row.push(cell);cell="";
      if(row.some(v=>v!==""))rows.push(row);
      row=[];
    }else cell+=ch;
  }
  row.push(cell);
  if(row.some(v=>v!==""))rows.push(row);
  return rows;
}
function csvCell(v){return /[",\r\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
document.getElementById("run").addEventListener("click",()=>{
  if(!input.value.trim()){alert("CSVを貼り付けてください。");return}
  const rows=parseCSV(input.value);
  const start=header.checked?1:0;
  const seen=new Set(),kept=rows.slice(0,start);
  for(let i=start;i<rows.length;i++){
    const key=rows[i].map(v=>ignoreSpace.checked?v.trim():v).join("\u001f");
    if(!seen.has(key)){seen.add(key);kept.push(rows[i])}
  }
  const removed=rows.length-kept.length;
  output.value=kept.map(r=>r.map(csvCell).join(",")).join("\n");
  stats.textContent="入力 "+rows.length+"行 → 出力 "+kept.length+"行（"+removed+"行の重複を削除）";
});
document.getElementById("copy").addEventListener("click",async()=>{
  if(!output.value){alert("コピーする結果がありません。");return}
  try{await navigator.clipboard.writeText(output.value)}catch(e){output.select();document.execCommand("copy")}
  alert("コピーしました。");
});
