const input=document.getElementById("input");
const rowsInput=document.getElementById("rows");
const output=document.getElementById("output");

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
function parseRowNumbers(text,max){
  const set=new Set();
  for(const part of text.split(",")){
    const s=part.trim();
    if(!s)continue;
    if(/^\d+$/.test(s)){const n=Number(s);if(n>=1&&n<=max)set.add(n-1);else return null}
    else if(/^(\d+)\s*-\s*(\d+)$/.test(s)){
      const [,a,b]=s.match(/^(\d+)\s*-\s*(\d+)$/).map(Number);
      if(a<1||b<a||b>max)return null;
      for(let n=a;n<=b;n++)set.add(n-1);
    }else return null;
  }
  return set;
}
function process(mode){
  if(!input.value.trim()){alert("CSVを貼り付けてください。");return}
  const data=parseCSV(input.value);
  const target=parseRowNumbers(rowsInput.value,data.length);
  if(!target||!target.size){alert("行番号を正しく入力してください。例：2,4 または 2-5");return}
  const kept=data.filter((_,i)=>mode==="extract"?target.has(i):!target.has(i));
  output.value=kept.map(r=>r.map(csvCell).join(",")).join("\n");
}
document.getElementById("extract").addEventListener("click",()=>process("extract"));
document.getElementById("remove").addEventListener("click",()=>process("remove"));
document.getElementById("copy").addEventListener("click",async()=>{
  if(!output.value){alert("コピーする結果がありません。");return}
  try{await navigator.clipboard.writeText(output.value)}catch(e){output.select();document.execCommand("copy")}
  alert("コピーしました。");
});
