export const CROSSINGS = [
  {name:'The first crossing',target:8,duration:120,fish:2,description:'Gather 8 lanterns'},
  {name:'The restless tide',target:12,duration:110,fish:4,description:'Gather 12 lanterns'},
  {name:'A thousand dawns',target:16,duration:105,fish:6,description:'Gather 16 lanterns'},
];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export class LanternWorld {
  constructor(level=0,totalScore=0,upgrades={speed:0,beam:0}){
    this.level=level;this.rules=CROSSINGS[level];this.score=totalScore;this.time=0;this.rescued=0;this.hull=3;this.status='playing';this.combo=0;this.bestChain=0;this.events=[];this.particles=[];this.wakes=[];
    this.upgrades={...upgrades};this.home={x:160,y:315};this.player={x:290,y:320,vx:0,vy:0,angle:0,dash:0,cooldown:0,invulnerable:0};
    this.lanterns=[];this.fish=[];this.chain=[];
    for(let i=0;i<this.rules.target+6;i++){const a=i*2.39996,r=85+(i%4)*45;this.lanterns.push({x:610+Math.cos(a)*r,y:320+Math.sin(a)*r,phase:i*1.7,attached:false,saved:false});}
    for(let i=0;i<this.rules.fish;i++)this.fish.push({x:620+i*55,y:180+i*120,angle:i*2.1,phase:i*3.3});
  }
  emit(kind,text){this.events.push({kind,text});}
  burst(x,y,color,count=20){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=25+Math.random()*110;this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.6+Math.random()*.7,color});}}
  update(dt,input){
    if(this.status!=='playing')return;this.time+=dt;
    const p=this.player;const movement=input.movement(p);p.cooldown=Math.max(0,p.cooldown-dt);p.invulnerable=Math.max(0,p.invulnerable-dt);p.dash=Math.max(0,p.dash-dt);
    if((input.take('ShiftLeft') || input.take('ShiftRight'))&&p.cooldown===0){p.dash=.32;p.cooldown=2.1;p.invulnerable=.55;this.emit('dash','Ride the current!');}
    const speed=p.dash>0?590:200+this.upgrades.speed*38;const drag=Math.max(.66,1-this.chain.length*.025);const smoothing=1-Math.exp(-12*dt);
    p.vx+=(movement.x*speed*drag-p.vx)*smoothing;p.vy+=(movement.y*speed*drag-p.vy)*smoothing;
    if(Math.hypot(p.vx,p.vy)>15)p.angle=Math.atan2(p.vy,p.vx);
    p.x=Math.max(45,Math.min(915,p.x+p.vx*dt));p.y=Math.max(105,Math.min(550,p.y+p.vy*dt));
    if(Math.hypot(p.vx,p.vy)>40&&Math.random()<dt*35)this.wakes.push({x:p.x-Math.cos(p.angle)*17,y:p.y-Math.sin(p.angle)*17,life:1,angle:p.angle});
    for(const light of this.lanterns){
      if(light.saved)continue;
      if(!light.attached){light.x+=Math.sin(this.time*.6+light.phase)*dt*7;light.y+=Math.cos(this.time*.7+light.phase)*dt*6;light.x=Math.max(60,Math.min(910,light.x));light.y=Math.max(130,Math.min(530,light.y));
        if(input.tethering&&distance(light,p)<125+this.upgrades.beam*35){light.attached=true;this.chain.push(light);this.burst(light.x,light.y,'#ffd38c',9);this.emit('collect',this.chain.length+' lanterns in tow · return to the lighthouse');}
      }
    }
    let leader=p;
    for(const light of this.chain){const d=distance(leader,light);if(d>27){const pull=Math.min(1,dt*7)*(d-27)/Math.max(d,1);light.x+=(leader.x-light.x)*pull;light.y+=(leader.y-light.y)*pull;}leader=light;}
    if(this.chain.length&&distance(p,this.home)<78){
      const count=this.chain.length;this.rescued+=count;this.bestChain=Math.max(this.bestChain,count);this.score+=count*100+(count>=3?count*50:0);this.combo=count>=3?count:0;
      for(const light of this.chain){light.saved=true;this.burst(light.x,light.y,'#ffe1a0',10);}this.chain=[];
      this.emit('deliver',count>=3?'+'+(count*150)+' · '+count+'-LIGHT COMBO!':'A wish made it home. +100');
      if(this.rescued>=this.rules.target){this.status='won';this.score+=Math.ceil(this.rules.duration-this.time)*5;this.emit('win','The harbor is shining.');}
    }
    for(const fish of this.fish){
      const lure=this.chain.length?this.chain[this.chain.length-1]:p;const hunting=distance(fish,lure)<260&&this.time>5;
      const angle=hunting?Math.atan2(lure.y-fish.y,lure.x-fish.x):fish.phase+this.time*.32;
      let turn=((angle-fish.angle+Math.PI*3)%(Math.PI*2))-Math.PI;fish.angle+=turn*Math.min(1,dt*2);
      const s=hunting?94+this.level*16:55;fish.x+=Math.cos(fish.angle)*s*dt;fish.y+=Math.sin(fish.angle)*s*dt;
      if(fish.x<310||fish.x>935||fish.y<135||fish.y>545){fish.angle+=Math.PI*.8;fish.x=Math.max(311,Math.min(934,fish.x));fish.y=Math.max(136,Math.min(544,fish.y));}
      if(distance(fish,p)<29&&p.invulnerable<=0&&distance(p,this.home)>100){
        this.hull--;p.invulnerable=2.5;this.burst(p.x,p.y,'#ff897e',28);for(const light of this.chain){light.attached=false;light.x+=Math.random()*60-30;light.y+=Math.random()*60-30;}this.chain=[];this.emit('hit','Cargo scattered. Dash past the shadowfish!');
      }
    }
    for(const particle of this.particles){particle.life-=dt;particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;particle.vx*=1-dt;particle.vy*=1-dt;}
    this.particles=this.particles.filter(p=>p.life>0);for(const wake of this.wakes)wake.life-=dt;this.wakes=this.wakes.filter(w=>w.life>0);
    if((this.hull<=0 || this.time>=this.rules.duration)&&this.status==='playing'){this.status='lost';this.emit('end',this.hull<=0?'The sea kept your skiff.':'The storm has arrived.');}
  }
}
