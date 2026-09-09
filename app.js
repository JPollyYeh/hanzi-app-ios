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
let order=[...cards], index=0;
let attempts=+(localStorage.getItem("attempts")||0), known=+(localStorage.getItem("known")||0), streak=+(localStorage.getItem("streak")||0);
const $=id=>document.getElementById(id), cardEl=$("flashcard"), canvas=$("drawCanvas"), ctx=canvas.getContext("2d");
let paths=[], currentPath=null, drawing=false;
function resizeCanvas(){const r=canvas.getBoundingClientRect(),d=window.devicePixelRatio||1;canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);redraw()}
function redraw(){const r=canvas.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height);ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="#1e1e1c";ctx.lineWidth=6;for(const path of paths){if(!path.length)continue;ctx.beginPath();ctx.moveTo(path[0].x,path[0].y);if(path.length===1){ctx.lineTo(path[0].x+.1,path[0].y+.1)}else for(const p of path.slice(1))ctx.lineTo(p.x,p.y);ctx.stroke()}}
function posFromClient(x,y){const r=canvas.getBoundingClientRect();return{x:x-r.left,y:y-r.top}}
function start(p){drawing=true;currentPath=[p];paths.push(currentPath);redraw()}
function move(p){if(!drawing||!currentPath)return;currentPath.push(p);redraw()}
function end(){drawing=false;currentPath=null}
// Pointer Events for modern iOS and Apple Pencil.
canvas.addEventListener("pointerdown",e=>{e.preventDefault();try{canvas.setPointerCapture(e.pointerId)}catch(_){}start(posFromClient(e.clientX,e.clientY))},{passive:false});
canvas.addEventListener("pointermove",e=>{if(!drawing)return;e.preventDefault();move(posFromClient(e.clientX,e.clientY))},{passive:false});
canvas.addEventListener("pointerup",e=>{e.preventDefault();end()},{passive:false});
canvas.addEventListener("pointercancel",end,{passive:false});
// Explicit touch fallback for iOS/Safari versions where Pointer Events are unreliable.
if(!(window.PointerEvent)){
 canvas.addEventListener("touchstart",e=>{e.preventDefault();const t=e.changedTouches[0];start(posFromClient(t.clientX,t.clientY))},{passive:false});
 canvas.addEventListener("touchmove",e=>{e.preventDefault();const t=e.changedTouches[0];move(posFromClient(t.clientX,t.clientY))},{passive:false});
 canvas.addEventListener("touchend",e=>{e.preventDefault();end()},{passive:false});
 canvas.addEventListener("touchcancel",end,{passive:false});
}
$("clearBtn").onclick=()=>{paths=[];redraw()};$("undoBtn").onclick=()=>{paths.pop();redraw()};
function render(){const c=order[index];$("frontChar").textContent=c.char;$("frontMeaning").textContent=c.meaning;$("backChar").textContent=c.char;$("pinyin").textContent=c.pinyin;$("backMeaning").textContent=c.meaning;$("strokeCount").textContent=`${c.strokes} strokes`;$("strokeHint").textContent=`Suggested order: ${c.hint}`;$("example").textContent=c.example;$("progress").textContent=`Card ${index+1} of ${order.length}`;$("knownCount").textContent=known;$("practiceCount").textContent=attempts;$("streak").textContent=streak;paths=[];cardEl.classList.remove("flipped");requestAnimationFrame(resizeCanvas)}
function flip(on){cardEl.classList.toggle("flipped",on)}$("flipToBack").onclick=()=>flip(true);$("flipToFront").onclick=()=>flip(false);
document.querySelectorAll(".grade").forEach(btn=>btn.onclick=()=>{attempts++;if(btn.dataset.grade==="good"||btn.dataset.grade==="easy"){known++;streak++}else if(btn.dataset.grade==="again")streak=0;localStorage.setItem("attempts",attempts);localStorage.setItem("known",known);localStorage.setItem("streak",streak);index=(index+1)%order.length;render()});
$("shuffleBtn").onclick=()=>{order=[...cards].sort(()=>Math.random()-.5);index=0;render()};
window.addEventListener("resize",()=>requestAnimationFrame(resizeCanvas));window.addEventListener("orientationchange",()=>setTimeout(resizeCanvas,250));window.addEventListener("load",()=>{render();setTimeout(resizeCanvas,150)});
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
