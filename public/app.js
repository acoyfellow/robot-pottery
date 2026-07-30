const catalog={
  heads:[1,2,4].map(n=>`/assets/heads/${n}.png`),
  bodies:[1,2,3,4].map(n=>`/assets/bodies/${n}.png`),
  bases:[1,3,4].map(n=>`/assets/bases/${n}.png`),
  stickers:[1,2,3,4,5,6].map(n=>`/assets/stickers/${n}.png`)
};
const labels={heads:['Bumble','Blockly','Sunny'],bodies:['Tick-tock','Button box','Star belly','Barrel bot'],bases:['Hover plate','Bouncy boots','Moon wheel'],stickers:['Kind heart','Super star','Happy gear','Ladybug','Rainbow','Tiny rocket']};
const state={tab:'heads',heads:0,bodies:0,bases:0,stickers:1,hue:0,stars:Number(localStorage.getItem('robot-pottery-stars')||0),sound:true,spin:0,bakes:0};
const wishes=[
  {text:'Make a robot that can zoom!',part:'bases',index:2},
  {text:'Make a robot with a kind heart!',part:'stickers',index:0},
  {text:'Make a robot with a sunny smile!',part:'heads',index:2},
  {text:'Make a robot ready for a star party!',part:'stickers',index:1},
  {text:'Make a robot with bouncy boots!',part:'bases',index:1}
];
const namesA=['Bumble','Wiggle','Pip','Mochi','Doodle','Bloop','Twinkle','Noodle','Pebble','Zippy'];
const namesB=['Bot','Bop','Beep','Sprout','Wheels','Toot','Pop','Spark','Buddy','Bell'];
const $=selector=>document.querySelector(selector);
const tray=$('#tray');
const robot=$('#robot');
const robotWrap=$('#robot-wrap');
const images={heads:$('#robot-head'),bodies:$('#robot-body'),bases:$('#robot-base'),stickers:$('#robot-sticker')};
let wish=wishes[Math.floor(Math.random()*wishes.length)];
let audio;
let dragStart=null;

function tone(frequency,duration=.12,type='sine',delay=0){
  if(!state.sound)return;
  audio??=new AudioContext();
  const oscillator=audio.createOscillator();
  const gain=audio.createGain();
  oscillator.type=type;
  oscillator.frequency.value=frequency;
  gain.gain.setValueAtTime(.0001,audio.currentTime+delay);
  gain.gain.exponentialRampToValueAtTime(.12,audio.currentTime+delay+.015);
  gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+delay+duration);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(audio.currentTime+delay);
  oscillator.stop(audio.currentTime+delay+duration+.02);
}

function happySound(){[523,659,784,1047].forEach((frequency,index)=>tone(frequency,.22,'sine',index*.09));}
function tapSound(){tone(440,.09,'sine');}
function updateScore(){
  $('#stars').textContent=state.stars;
  localStorage.setItem('robot-pottery-stars',String(state.stars));
}
function updateWish(){
  $('#wish').textContent=wish.text;
  $('#mission').classList.toggle('matched',state[wish.part]===wish.index);
}
function updateRobot(part){
  for(const key of Object.keys(images))images[key].src=catalog[key][state[key]];
  robot.style.setProperty('--hue',`${state.hue}deg`);
  robot.style.setProperty('--spin',`${state.spin}deg`);
  if(part){
    images[part].classList.remove('pop');
    requestAnimationFrame(()=>images[part].classList.add('pop'));
  }
  updateWish();
}
function renderTray(){
  tray.replaceChildren();
  tray.dataset.tab=state.tab;
  catalog[state.tab].forEach((src,index)=>{
    const button=document.createElement('button');
    button.className=`part-choice${state[state.tab]===index?' selected':''}`;
    button.dataset.index=String(index);
    button.setAttribute('aria-label',labels[state.tab][index]);
    const image=document.createElement('img');
    image.src=src;
    image.alt='';
    button.append(image);
    button.addEventListener('click',()=>choosePart(state.tab,index));
    tray.append(button);
  });
}
function choosePart(part,index){
  state[part]=index;
  tapSound();
  updateRobot(part);
  renderTray();
  burst(10);
}
function selectTab(tab){
  state.tab=tab;
  document.querySelectorAll('.tab').forEach(button=>button.classList.toggle('active',button.dataset.tab===tab));
  renderTray();
  tapSound();
}
function burst(count=18){
  const box=$('#workshop').getBoundingClientRect();
  for(let index=0;index<count;index+=1){
    const spark=document.createElement('span');
    spark.className='spark';
    spark.textContent=['✨','⭐','●','◆'][index%4];
    spark.style.left=`${box.width*.5+(Math.random()-.5)*80}px`;
    spark.style.top=`${box.height*.55+(Math.random()-.5)*100}px`;
    spark.style.setProperty('--dx',`${(Math.random()-.5)*360}px`);
    spark.style.setProperty('--dy',`${-80-Math.random()*260}px`);
    spark.style.color=['#ffdb45','#76ddc4','#ff7952','#b69df2'][index%4];
    $('#sparkles').append(spark);
    setTimeout(()=>spark.remove(),1100);
  }
}
function surprise(){
  for(const part of Object.keys(catalog))state[part]=Math.floor(Math.random()*catalog[part].length);
  state.hue=[0,35,75,185,315][Math.floor(Math.random()*5)];
  document.querySelectorAll('.swatches button').forEach(button=>button.classList.toggle('selected',Number(button.dataset.hue)===state.hue));
  renderTray();
  updateRobot(state.tab);
  burst(26);
  [330,440,554].forEach((frequency,index)=>tone(frequency,.16,'triangle',index*.06));
}
function miniRobot(){
  const mini=$('#mini-robot');
  mini.replaceChildren();
  for(const part of ['base','body','head','sticker']){
    const key=part==='base'?'bases':part==='body'?'bodies':part==='head'?'heads':'stickers';
    const image=document.createElement('img');
    image.src=catalog[key][state[key]];
    image.className=`mini-${part}`;
    image.alt='';
    image.style.filter=`hue-rotate(${state.hue}deg) saturate(1.06)`;
    mini.append(image);
  }
}
function bake(){
  const kiln=$('#kiln');
  kiln.classList.add('show');
  tone(130,.7,'sawtooth');
  tone(196,.7,'triangle',.28);
  robotWrap.animate([{transform:'translateX(-50%) scale(1)'},{transform:'translateX(-50%) scale(.75)'},{transform:'translateX(-50%) scale(1)'}],{duration:1500,easing:'ease-in-out'});
  setTimeout(()=>{
    kiln.classList.remove('show');
    state.bakes+=1;
    const matched=state[wish.part]===wish.index;
    state.stars+=matched?5:3;
    updateScore();
    $('#robot-name').textContent=`${namesA[Math.floor(Math.random()*namesA.length)]}-${namesB[Math.floor(Math.random()*namesB.length)]}!`;
    $('.reward b').textContent=matched?'+5 wish stars!':'+3 pottery stars';
    miniRobot();
    $('#finished').showModal();
    burst(34);
    happySound();
  },1650);
}
function reset(){
  $('#finished').close();
  $('#finished .finished-card').classList.remove('dancing');
  wish=wishes[Math.floor(Math.random()*wishes.length)];
  updateWish();
}
function dance(){
  const card=$('#finished .finished-card');
  card.classList.toggle('dancing');
  [262,330,392,523,392,330].forEach((frequency,index)=>tone(frequency,.14,index%2?'square':'triangle',index*.12));
}
function beginDrag(event){
  dragStart={x:event.clientX,spin:state.spin};
  robotWrap.setPointerCapture(event.pointerId);
}
function drag(event){
  if(!dragStart)return;
  state.spin=dragStart.spin+(event.clientX-dragStart.x)*.9;
  const tilt=Math.max(-7,Math.min(7,(event.clientX-dragStart.x)*.04));
  robot.style.setProperty('--spin',`${state.spin}deg`);
  robot.style.setProperty('--tilt',`${tilt}deg`);
  $('.pottery-wheel i').style.transform=`rotate(${state.spin*2}deg)`;
}
function endDrag(){
  if(dragStart)tone(220,.08,'triangle');
  dragStart=null;
  robot.style.setProperty('--tilt','0deg');
}

document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>selectTab(button.dataset.tab)));
document.querySelectorAll('.swatches button').forEach(button=>button.addEventListener('click',()=>{
  state.hue=Number(button.dataset.hue);
  document.querySelectorAll('.swatches button').forEach(item=>item.classList.toggle('selected',item===button));
  updateRobot();
  tapSound();
}));
$('#surprise').addEventListener('click',surprise);
$('#bake').addEventListener('click',bake);
$('#again').addEventListener('click',reset);
$('#dance').addEventListener('click',dance);
$('#sound').addEventListener('click',event=>{
  state.sound=!state.sound;
  event.currentTarget.textContent=state.sound?'🔊':'🔇';
  if(state.sound)happySound();
});
robotWrap.addEventListener('pointerdown',beginDrag);
robotWrap.addEventListener('pointermove',drag);
robotWrap.addEventListener('pointerup',endDrag);
robotWrap.addEventListener('pointercancel',endDrag);

updateScore();
updateWish();
updateRobot();
renderTray();
document.querySelector('.swatches button').classList.add('selected');
window.__robotPottery={state:()=>({...state,wish:wish.text,matched:state[wish.part]===wish.index}),surprise,bake};
