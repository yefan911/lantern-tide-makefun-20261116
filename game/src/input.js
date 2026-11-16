export class CaptainInput {
  constructor(canvas) {
    this.keys = new Set(); this.pressed = new Set(); this.mouseHeld = false;
    this.pointer = null;
    window.addEventListener('keydown', event => {
      if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.code)) event.preventDefault();
      if (!this.keys.has(event.code)) this.pressed.add(event.code);
      this.keys.add(event.code);
    });
    window.addEventListener('keyup', event => this.keys.delete(event.code));
    window.addEventListener('blur', () => { this.keys.clear(); this.mouseHeld = false; });
    canvas.addEventListener('pointerdown', event => { this.mouseHeld = true; this.movePointer(event, canvas); canvas.setPointerCapture(event.pointerId); });
    canvas.addEventListener('pointermove', event => this.movePointer(event, canvas));
    canvas.addEventListener('pointerup', () => { this.mouseHeld = false; });
  }
  movePointer(event, canvas) { const box = canvas.getBoundingClientRect(); this.pointer = { x:(event.clientX-box.left)*960/box.width, y:(event.clientY-box.top)*600/box.height }; }
  take(code) { const value = this.pressed.has(code); this.pressed.delete(code); return value; }
  movement(player) {
    let x = +(this.keys.has('KeyD') || this.keys.has('ArrowRight')) - +(this.keys.has('KeyA') || this.keys.has('ArrowLeft'));
    let y = +(this.keys.has('KeyS') || this.keys.has('ArrowDown')) - +(this.keys.has('KeyW') || this.keys.has('ArrowUp'));
    if (!x && !y && this.mouseHeld && this.pointer) { x = this.pointer.x-player.x; y = this.pointer.y-player.y; if(Math.hypot(x,y)<12) return {x:0,y:0}; }
    const length = Math.hypot(x,y) || 1;
    return { x:x/length, y:y/length };
  }
  get tethering() { return this.keys.has('Space') || this.mouseHeld; }
}
