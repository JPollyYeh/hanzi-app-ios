const cards = [
  {char:"你",pinyin:"nǐ",meaning:"you",strokes:7,hint:"撇 → 竖 → 撇 → 横钩 → 竖钩 → 撇 → 点",example:"你好 — nǐ hǎo — hello"},
  {char:"好",pinyin:"hǎo",meaning:"good; well",strokes:6,hint:"撇点 → 撇 → 横 → 横撇 → 竖钩 → 横",example:"很好 — hěn hǎo — very good"},
  {char:"我",pinyin:"wǒ",meaning:"I; me",strokes:7,hint:"撇 → 横 → 竖钩 → 提 → 斜钩 → 撇 → 点",example:"我是学生 — wǒ shì xuéshēng — I am a student"},
  {char:"是",pinyin:"shì",meaning:"to be; yes",strokes:9,hint:"竖 → 横折 → 横 → 横 → 横 → 竖 → 横 → 撇 → 捺",example:"是的 — shì de — yes / that's right"},
  {char:"人",pinyin:"rén",meaning:"person",strokes:2,hint:"撇 → 捺",example:"中国人 — Zhōngguó rén — Chinese person"},
  {char:"中",pinyin:"zhōng",meaning:"middle; China (in compounds)",strokes:4,hint:"竖 → 横折 → 横 → 竖",example:"中文 — Zhōngwén — Chinese language"},
  {char:"大",pinyin:"dà",meaning:"big",strokes:3,hint:"横 → 撇 → 捺",example:"大学 — dàxué — university"},
  {char:"小",pinyin:"xiǎo",meaning:"small",strokes:3,hint:"竖钩 → 撇 → 点",example:"小时 — xiǎoshí — hour"},
  {char:"水",pinyin:"shuǐ",meaning:"water",strokes:4,hint:"竖钩 → 横撇 → 撇 → 捺",example:"喝水 — hē shuǐ — drink water"},
  {char:"山",pinyin:"shān",meaning:"mountain",strokes:3,hint:"竖 → 竖折 → 竖",example:"高山 — gāoshān — high mountain"}
];

let order = [...cards];
let index = 0;
let attempts = +(localStorage.getItem("attempts") || 0);
let known = +(localStorage.getItem("known") || 0);
let streak = +(localStorage.getItem("streak") || 0);

const $ = id => document.getElementById(id);
const cardEl = $("flashcard");
const canvas = $("drawCanvas");
const ctx = canvas.getContext("2d", {alpha:true});
let paths = [];
let currentPath = null;
let drawing = false;

function resizeCanvas(){
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale,0,0,scale,0,0);
  redraw();
}
function redraw(){
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0,0,rect.width,rect.height);
  ctx.lineCap="round"; ctx.lineJoin="round"; ctx.strokeStyle="#1e1e1c"; ctx.lineWidth=6;
  for(const path of paths){
    if(path.length<2) continue;
    ctx.beginPath(); ctx.moveTo(path[0].x,path[0].y);
    for(const p of path.slice(1)) ctx.lineTo(p.x,p.y);
    ctx.stroke();
  }
}
function point(e){
  const r = canvas.getBoundingClientRect();
  return {x:e.clientX-r.left,y:e.clientY-r.top};
}
canvas.addEventListener("pointerdown", e=>{
  drawing=true; canvas.setPointerCapture(e.pointerId);
  currentPath=[point(e)]; paths.push(currentPath); redraw();
});
canvas.addEventListener("pointermove", e=>{
  if(!drawing) return;
  currentPath.push(point(e)); redraw();
});
["pointerup","pointercancel","pointerleave"].forEach(type=>canvas.addEventListener(type,()=>{drawing=false;currentPath=null;}));

$("clearBtn").onclick=()=>{paths=[];redraw()};
$("undoBtn").onclick=()=>{paths.pop();redraw()};

function render(){
  const c=order[index];
  $("frontChar").textContent=c.char;
  $("frontMeaning").textContent=c.meaning;
  $("backChar").textContent=c.char;
  $("pinyin").textContent=c.pinyin;
  $("backMeaning").textContent=c.meaning;
  $("strokeCount").textContent=`${c.strokes} strokes`;
  $("strokeHint").textContent=`Suggested order: ${c.hint}`;
  $("example").textContent=c.example;
  $("progress").textContent=`Card ${index+1} of ${order.length}`;
  $("knownCount").textContent=known;
  $("practiceCount").textContent=attempts;
  $("streak").textContent=streak;
  paths=[]; redraw(); cardEl.classList.remove("flipped");
}
function flip(on){cardEl.classList.toggle("flipped",on)}
$("flipToBack").onclick=()=>flip(true);
$("flipToFront").onclick=()=>flip(false);

document.querySelectorAll(".grade").forEach(btn=>{
  btn.onclick=()=>{
    attempts++;
    if(btn.dataset.grade==="good" || btn.dataset.grade==="easy"){known++;streak++;}
    else if(btn.dataset.grade==="again"){streak=0;}
    localStorage.setItem("attempts",attempts);
    localStorage.setItem("known",known);
    localStorage.setItem("streak",streak);
    index=(index+1)%order.length;
    render();
  }
});
$("shuffleBtn").onclick=()=>{
  order=[...cards].sort(()=>Math.random()-.5);
  index=0; render();
};
window.addEventListener("resize",resizeCanvas);
window.addEventListener("load",()=>{render();setTimeout(resizeCanvas,60)});

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").catch(()=>{});
}
