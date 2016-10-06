'''
This code is taken from here - http://codeincomplete.com/posts/javascript-game-foundations-the-game-loop/

Anyway, I know what it does. This uses the difference between last (set at the end of the loop)
and now (set at the start of the loop), to calculate how long each loop actually takes on the
client side. It is important for the user exp that the game loop takes the same amount of time
for every user. In the while loop, the board keeps updating without animating. JavaScript allows
the requestAnimationFrame to let us know when we can animate again, so there is no point updating
the canvas any more than that.
'''

var now,
    dt   = 0,
    last = timestamp(),
    step = 1/60;

function frame() {
  now = timestamp();
  dt = dt + Math.min(1, (now - last) / 1000);
  while(dt > step) {
    dt = dt - step;
    update(step);
  }
  render(dt);
  last = now;
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);