export class OceanAudio {
  constructor(){this.context=null;this.enabled=false;this.nextNote=0;this.note=0;}
  enable(){this.context ??= new (window.AudioContext || window.webkitAudioContext)();this.context.resume();this.enabled=true;}
  tone(frequency,duration=.2,volume=.08,type='sine') {
    if(!this.enabled || !this.context)return;
    const now=this.context.currentTime,osc=this.context.createOscillator(),gain=this.context.createGain();
    osc.type=type;osc.frequency.setValueAtTime(frequency,now);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(volume,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    osc.connect(gain);gain.connect(this.context.destination);osc.start(now);osc.stop(now+duration);
  }
  event(kind){if(kind==='collect'){this.tone(659,.25);this.tone(988,.4,.04);}if(kind==='deliver'){this.tone(523,.4);setTimeout(()=>this.tone(784,.5),90);setTimeout(()=>this.tone(1047,.7),180);}if(kind==='hit')this.tone(90,.35,.1,'triangle');if(kind==='dash')this.tone(220,.2,.04,'triangle');if(kind==='win'){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>this.tone(f,.8,.06),i*120));}}
  ambience(time){if(time<this.nextNote)return;this.nextNote=time+1.9;const notes=[130.81,196,261.63,293.66,196,329.63,261.63,196];this.tone(notes[this.note++%notes.length],1.7,.018);}
}
