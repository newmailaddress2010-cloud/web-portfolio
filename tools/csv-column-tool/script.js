const input=document.getElementById("input");
const columns=document.getElementById("columns");
const output=document.getElementById("output");

function parseColumnNumbers(){
  const values=columns.value.split(",").map(v=>Number(v.trim())).filter(v=>Number.isInteger(v)&&v>0);
  return [...new Set(values)];
}

function parseCSV(text){
  const rows=[];
  let row=[],cell="",quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(ch==='"'){
      if(quoted&&text[i+1]==='"'){cell+='"';i++}
      else quoted=!quoted;
    }else if(ch===","&&!quoted){
      row.push(cell);cell="";
    }else if((ch==="\n"||ch==="\r")&&!quoted){
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

function csvCell(value){
  if(/[",\r\n]/.test(value)) return '"'+value.replace(/"/g,'""')+'"';
  return value;
}

function process(mode){
  if(!input.value.trim()){alert("CSVを貼り付けてください。");return}
  const nums=parseColumnNumbers();
  if(!nums.length){alert("列番号を1つ以上入力してください。");return}
  const rows=parseCSV(input.value);
  const max=Math.max(...rows.map(r=>r.length),0);
  if(nums.some(n=>n>max)){alert("存在しない列番号が含まれています。");return}
  const set=new Set(nums.map(n=>n-1));
  const result=rows.map(row=>{
    const indexes=mode==="extract"
      ? [...set].sort((a,b)=>a-b)
      : row.map((_,i)=>i).filter(i=>!set.has(i));
    return indexes.map(i=>csvCell(row[i]??"")).join(",");
  });
  output.value=result.join("\n");
}

document.getElementById("extract").addEventListener("click",()=>process("extract"));
document.getElementById("remove").addEventListener("click",()=>process("remove"));
document.getElementById("copy").addEventListener("click",async()=>{
  if(!output.value){alert("コピーする結果がありません。");return}
  try{await navigator.clipboard.writeText(output.value);alert("コピーしました。")}
  catch(e){output.select();document.execCommand("copy");alert("コピーしました。")}
});
