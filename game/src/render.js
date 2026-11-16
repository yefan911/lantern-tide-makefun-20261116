const TAU=Math.PI*2;
export class MoonlitRenderer {
  constructor(canvas){this.ctx=canvas.getContext('2d');this.canvas=canvas;this.stars=Array.from({length:90},(_,i)=>({x:(i*137.507)%960,y:20+(i*49.371)%550,s:.5+(i%4)*.3}));}
  glow(x,y,r,color){const c=this.ctx,g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#00000000');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  text(text,x,y,color='#bfd9ce',size=10){const c=this.ctx;c.fillStyle=color;c.font=`${size}px Arial`;c.textAlign='center';c.fillText(text,x,y);}
  render(world,clock,tether=false){
    const c=this.ctx;c.clearRect(0,0,960,600);const background=c.createLinearGradient(0,0,0,600);background.addColorStop(0,'#102c43');background.addColorStop(.5,'#104a58');background.addColorStop(1,'#092b3c');c.fillStyle=background;c.fillRect(0,0,960,600);
    this.glow(735,170,360,'#6de2c522');this.glow(150,310,240,'#ffc6701e');
    c.lineWidth=1;
    for(let row=0;row<23;row++){const y=100+row*24;c.strokeStyle=`rgba(133,205,197,${.035+(row%3)*.008})`;c.beginPath();for(let x=-20;x<=980;x+=12){const z=y+Math.sin(x*.011+clock*.28+row*.7)*11+Math.sin(x*.019-clock*.2)*3;x===-20?c.moveTo(x,z):c.lineTo(x,z);}c.stroke();}
    for(const s of this.stars){c.fillStyle=`rgba(175,235,223,${.16+Math.sin(clock+s.x)*.12})`;c.beginPath();c.arc(s.x,s.y,s.s,0,TAU);c.fill();}
    this.drawCoast(clock);this.drawLighthouse(world,clock);
    for(const wake of world.wakes){c.globalAlpha=wake.life*.28;c.strokeStyle='#a6eee0';c.lineWidth=2;c.beginPath();c.ellipse(wake.x,wake.y,8+(1-wake.life)*18,3+(1-wake.life)*8,wake.angle,0,TAU);c.stroke();}c.globalAlpha=1;
    if(tether&&world.status==='playing'){const p=world.player,radius=125+world.upgrades.beam*35;this.glow(p.x,p.y,radius,'#86f3d325');c.strokeStyle='#8bf6d577';c.setLineDash([3,10]);c.beginPath();c.arc(p.x,p.y,radius,clock*.3,TAU+clock*.3);c.stroke();c.setLineDash([]);}
    let leader=world.player;for(const light of world.chain){c.strokeStyle='#ffdea6a0';c.lineWidth=1.6;c.beginPath();c.moveTo(leader.x,leader.y);c.quadraticCurveTo((leader.x+light.x)/2,(leader.y+light.y)/2+8,light.x,light.y);c.stroke();leader=light;}
    for(const light of world.lanterns)if(!light.saved)this.drawLantern(light,clock);
    for(const fish of world.fish)this.drawShadowfish(fish,clock);
    this.drawSkiff(world.player,clock);
    if(world.chain.length&&world.status==='playing')this.drawHarborBearing(world);
    for(const p of world.particles){c.globalAlpha=Math.min(1,p.life);c.fillStyle=p.color;c.fillRect(p.x,p.y,2.8,2.8);}c.globalAlpha=1;
    this.drawCompass(clock);this.drawMoon(clock);
    if(world.time>world.rules.duration*.7){c.fillStyle=`rgba(39,28,69,${.06+Math.sin(clock)*.02})`;c.fillRect(0,0,960,600);}
  }
  drawCoast(clock){const c=this.ctx;
    c.fillStyle='#061f2d';c.beginPath();c.moveTo(0,120);c.bezierCurveTo(45,95,10,166,77,190);c.bezierCurveTo(121,222,34,247,79,285);c.bezierCurveTo(108,321,12,357,45,407);c.bezierCurveTo(95,467,31,477,0,526);c.closePath();c.fill();
    const islands=[{x:825,y:484,r:47},{x:420,y:147,r:25},{x:892,y:219,r:32},{x:382,y:505,r:22}];
    for(const island of islands){c.save();c.translate(island.x,island.y);c.strokeStyle='#72bcb632';c.lineWidth=2;c.beginPath();c.ellipse(0,9,island.r+13,island.r*.45+8,0,0,TAU);c.stroke();c.fillStyle='#082d37';c.beginPath();c.ellipse(0,0,island.r,island.r*.45,0,0,TAU);c.fill();c.strokeStyle='#41696b';c.lineWidth=1;c.stroke();c.fillStyle='#27585a';c.beginPath();c.moveTo(-island.r*.7,0);c.lineTo(-island.r*.22,-island.r*.64);c.lineTo(island.r*.6,2);c.fill();for(let i=0;i<5;i++){this.glow(Math.cos(i*2)*island.r*.6,Math.sin(i*2)*island.r*.17,8,'#8eedbe33');c.fillStyle='#88d2ae';c.fillRect(Math.cos(i*2)*island.r*.6,Math.sin(i*2)*island.r*.17,2,2);}c.restore();}
  }
  drawHarborBearing(world){const c=this.ctx,p=world.player,angle=Math.atan2(world.home.y-p.y,world.home.x-p.x);c.save();c.translate(p.x,p.y);c.rotate(angle);c.translate(54,0);c.fillStyle='#ffe3a8';c.beginPath();c.moveTo(10,0);c.lineTo(-3,-5);c.lineTo(-3,5);c.closePath();c.fill();c.restore();this.text('HOME',p.x+Math.cos(angle)*73,p.y+Math.sin(angle)*73+4,'#ffe3a8',8);}
  drawLighthouse(world,clock){const c=this.ctx,{x,y}=world.home;
    this.glow(x,y,155,'#ffe0a32b');c.strokeStyle='#d7ba7860';c.lineWidth=1;c.setLineDash([3,7]);c.beginPath();c.ellipse(x,y+12,78,53,0,0,TAU);c.stroke();c.setLineDash([]);
    c.save();c.translate(x,y);c.fillStyle='#143d44';c.beginPath();c.ellipse(0,12,56,30,0,0,TAU);c.fill();c.strokeStyle='#7c9a7c';c.stroke();c.fillStyle='#405f56';c.beginPath();c.moveTo(-31,5);c.lineTo(-18,-17);c.lineTo(30,-12);c.lineTo(47,12);c.lineTo(4,27);c.closePath();c.fill();
    c.fillStyle='#d6c697';c.beginPath();c.moveTo(-11,6);c.lineTo(-8,-67);c.lineTo(8,-67);c.lineTo(13,6);c.closePath();c.fill();c.fillStyle='#354d47';c.fillRect(-7,-48,14,4);c.fillRect(-9,-20,18,4);c.fillStyle='#ffeab4';c.fillRect(-12,-79,24,14);this.glow(0,-72,46,'#ffdf9280');c.fillStyle='#1b393e';c.beginPath();c.moveTo(-17,-80);c.lineTo(0,-94);c.lineTo(17,-80);c.closePath();c.fill();c.fillRect(-3,-99,6,7);
    c.save();c.translate(0,-72);c.rotate(Math.sin(clock*.25)*.45);const g=c.createLinearGradient(0,0,260,0);g.addColorStop(0,'#ffdd8b30');g.addColorStop(1,'#ffdd8b00');c.fillStyle=g;c.beginPath();c.moveTo(0,0);c.lineTo(265,-70);c.lineTo(265,70);c.closePath();c.fill();c.restore();
    for(let i=0;i<Math.min(world.rescued,16);i++){const a=i*TAU/16;this.glow(Math.cos(a)*46,14+Math.sin(a)*22,12,'#ffc97d66');c.fillStyle='#ffd58e';c.beginPath();c.arc(Math.cos(a)*46,14+Math.sin(a)*22,2.5,0,TAU);c.fill();}c.restore();
    this.text('SAFE HARBOR',x,y+70,'#d4caa1',9);this.text('DELIVER YOUR LIGHTS HERE',x,y+85,'#7fb5ac',7);
  }
  drawLantern(light,clock){const c=this.ctx,x=light.x,y=light.y+Math.sin(clock*2+light.phase)*3;this.glow(x,y,light.attached?31:24,'#ffc96a40');c.strokeStyle='#ffd69033';c.lineWidth=1;c.beginPath();c.ellipse(x,y+10,13,4,0,0,TAU);c.stroke();c.fillStyle=light.attached?'#ffefb3':'#ffcd81';c.beginPath();c.moveTo(x,y-7);c.quadraticCurveTo(x+8,y-3,x+5,y+5);c.lineTo(x-5,y+5);c.quadraticCurveTo(x-8,y-3,x,y-7);c.fill();c.fillStyle='#947b50';c.fillRect(x-4,y+5,8,2);c.fillStyle='#fff5d4';c.fillRect(x-1,y-3,2,5);}
  drawSkiff(p,clock){const c=this.ctx;if(p.invulnerable>0&&Math.sin(clock*32)<0)c.globalAlpha=.5;this.glow(p.x,p.y,38,p.dash>0?'#98ffdf55':'#a3f9df19');c.save();c.translate(p.x,p.y);c.rotate(p.angle);c.fillStyle='#051c2e88';c.beginPath();c.ellipse(0,7,23,11,0,0,TAU);c.fill();c.fillStyle='#ab7655';c.strokeStyle='#ffd1a0';c.lineWidth=1.5;c.beginPath();c.moveTo(24,0);c.quadraticCurveTo(0,-18,-19,-8);c.lineTo(-19,8);c.quadraticCurveTo(0,18,24,0);c.closePath();c.fill();c.stroke();c.fillStyle='#274b4a';c.fillRect(-11,-6,24,12);c.strokeStyle='#5bdbc5';c.lineWidth=2;c.beginPath();c.moveTo(-4,-19);c.lineTo(3,19);c.stroke();c.fillStyle='#e4dbb5';c.beginPath();c.arc(2,0,5,0,TAU);c.fill();this.glow(14,0,21,'#ffe8ad55');c.fillStyle='#ffe5a2';c.beginPath();c.arc(14,0,3,0,TAU);c.fill();c.restore();c.globalAlpha=1;}
  drawShadowfish(fish,clock){const c=this.ctx;c.save();c.translate(fish.x,fish.y);c.rotate(fish.angle);this.glow(0,0,30,'#957ac128');c.fillStyle='#0a162d';c.strokeStyle='#66709c';c.lineWidth=1;c.beginPath();c.moveTo(24,0);c.bezierCurveTo(8,-15,-12,-14,-21,0);c.bezierCurveTo(-10,13,10,14,24,0);c.fill();c.stroke();c.beginPath();c.moveTo(-19,0);c.lineTo(-31,-10+Math.sin(clock*7)*3);c.lineTo(-31,10+Math.sin(clock*7)*3);c.closePath();c.fill();c.fillStyle='#fda8a1';c.beginPath();c.arc(13,-3,2,0,TAU);c.fill();c.restore();}
  drawCompass(clock){const c=this.ctx;c.save();c.translate(888,515);c.strokeStyle='#93c3bd44';c.lineWidth=1;c.beginPath();c.arc(0,0,27,0,TAU);c.stroke();c.beginPath();c.moveTo(-32,0);c.lineTo(32,0);c.moveTo(0,-32);c.lineTo(0,32);c.stroke();c.fillStyle='#accbb8';c.beginPath();c.moveTo(0,-21);c.lineTo(5,8);c.lineTo(0,3);c.lineTo(-5,8);c.closePath();c.fill();this.text('N',0,-38,'#8ab6ad',8);c.restore();}
  drawMoon(clock){const c=this.ctx;this.glow(800,66,60,'#d4ecc31b');c.fillStyle='#d6dbb5';c.beginPath();c.arc(800,66,17,0,TAU);c.fill();c.fillStyle='#102e43';c.beginPath();c.arc(806,61,15,0,TAU);c.fill();}
}
