new class{constructor(t,e,i,s,n,h,a){this.container=document.querySelector("."+t),this.canvas=document.getElementById(e),this.ctx=this.canvas.getContext("2d"),this.width=this.canvas.width/2,this.height=this.canvas.height/2,this.startTime=(new Date).getTime(),this.message=document.getElementById(i),this.scoreboard=document.getElementById(s),this.difficultyRange=document.getElementById(n),this.scoreRange=document.getElementById(h),this.resetButton=document.getElementById(a),this.isGameActive=!0,this.click=0,this.score=0,this.win=1e3,this.difficulty=5,this.pointsPerClick=50,this.endTime=0,this.init()}init(){this.difficultyRange.addEventListener("change",this.setDifficulty.bind(this),!1),this.scoreRange.addEventListener("change",this.setPointsPerClick.bind(this),!1),this.resetButton.addEventListener("click",this.reset.bind(this)),this.canvas.addEventListener("click",this.clickHandler.bind(this),!1),this.interval=setInterval(this.game.bind(this),this.difficulty)}setDifficulty(){this.score=0,this.click=0,this.startTime=(new Date).getTime(),this.difficulty=this.difficultyRange.value,clearInterval(this.interval),this.interval=setInterval(this.game.bind(this),this.difficulty)}setPointsPerClick(){this.score=0,this.click=0,this.startTime=(new Date).getTime(),this.pointsPerClick=this.scoreRange.value}drawCircle(){this.score>this.win&&(this.score=this.win),this.ctx.beginPath(),this.ctx.arc(this.width,this.height,this.canvas.width/2.25,0,2*Math.PI),this.ctx.strokeStyle="#aaa",this.ctx.lineWidth=25,this.ctx.stroke(),this.ctx.closePath(),this.ctx.beginPath(),this.ctx.arc(this.width,this.height,this.canvas.width/2.25,0,2*Math.PI*this.score/this.win),this.ctx.strokeStyle="#0095DD",this.ctx.lineWidth=25,this.ctx.stroke(),this.ctx.closePath(),this.ctx.setTransform(1,0,0,1,0,0)}drawScore(){this.scoreboard.textContent=`score: ${this.score} - click: ${this.click}`}reset(){this.score=0,this.click=0,this.message.textContent="Reset",this.scoreboard.textContent="",(this.isGameActive||this.canStartNewGame())&&(this.isGameActive=!0)}handlePlusOneAnimation(t,e){const i=document.createElement("div");i.className="animated-el click-animation",i.textContent="🔝",i.style.position="absolute",i.style.left=t+"px",i.style.top=e+"px",i.style.transform="translateY(0)",i.style.transition="transform 1.5s ease-out, opacity 1s ease-in",this.container.appendChild(i),new Promise((function(t){setTimeout((()=>t(1)),100)})).then((function(){const t=Math.round(150*Math.random())+100;i.style.transform=`translateY(-${t}px) scale(3)`,i.style.opacity=0,setTimeout((()=>{i.remove()}),3e3)}))}canStartNewGame(){return((new Date).getTime()-this.endTime)/1e3>=5}handleGravityAnimation(t,e){const i=document.createElement("img");i.src="assets/fff.png",i.className="animated-el gravity-animation",this.container.appendChild(i);const s=10*Math.random()+2,n=-1*Math.random()*Math.PI,h=s*Math.cos(n);let a=s*Math.sin(n);const c=window.innerHeight;let r=t-i.width/2,o=e-i.height/2;i.style.left=r+"px",i.style.top=o+"px";const l=()=>{r+=h,o+=a,a+=.2,a+=.2,o>c?i.remove():(i.style.left=r+"px",i.style.top=o+"px",requestAnimationFrame(l))};l()}clickHandler(t){if(!this.isGameActive&&this.canStartNewGame())this.reset(),this.isGameActive=!0,this.startTime=(new Date).getTime();else if(this.score!==this.win&&this.isGameActive){this.score+=this.pointsPerClick,this.click++;const e=this.container.getBoundingClientRect(),i=t.clientX-e.left,s=t.clientY-e.top;this.handlePlusOneAnimation(i,s),this.handleGravityAnimation(i,s)}}winnerWinner(){this.isGameActive=!1,this.endTime=(new Date).getTime();const t=(this.endTime-this.startTime)/1e3,e=1e3/t,i=1e3*this.click,s=1e3/parseInt(this.difficulty),n=1e5/parseInt(this.pointsPerClick),h=Math.floor((e+i+s+n)/4);this.message.textContent=`YOU WIN 🎉!\nScore: ${h}`,this.scoreboard.textContent=`Time: ${t.toFixed(2)}s - Clicks: ${this.click}`}game(){if(this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawCircle(),this.isGameActive&&(0===this.score?(this.message.textContent="tap the screen to start",this.scoreboard.textContent=`difficulty: ${this.difficulty} - ppc: ${this.pointsPerClick}`):this.drawScore()),this.score>=this.win){if(!this.isGameActive)return!0;this.winnerWinner()}else 0===this.score?(this.score=0,this.startTime=(new Date).getTime()):this.score-=1}}("container","canvas","message","scoreboard","slider-difficulty","slider-score-size","reset");