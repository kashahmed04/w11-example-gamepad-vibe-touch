import './reset.css';
import './styles.css';

import 'hammerjs';

// scale the canvas based on the window viewport
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// the image is 1600px wide, figure out what the scale should be to make it fit the width
const SCALE = (WIDTH - 20) / 1600;

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
canvas.width = WIDTH;
canvas.height = HEIGHT;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

// initialize the Hammer manager
const mc = new Hammer.Manager(canvas);

// start tracking Pan, Rotate, Pinch gestures
mc.add(new Hammer.Pan({ threshold: 0 }));
mc.add(new Hammer.Rotate({ threshold: 0 }).recognizeWith([mc.get('pan')]));
mc.add(
  new Hammer.Pinch({ threshold: 0 }).recognizeWith([
    mc.get('pan'),
    mc.get('rotate'),
  ]),
);

// track the transform values to be used when drawing
let transform = {
  scale: SCALE,
  angle: 0,
  translate: {
    x: 0,
    y: 0,
  },
};

let touchesActive = false;

// change the translate x and y with pan gestures
let start_x = 0;
let start_y = 0;
function onPan(ev: any) {
  if (ev.type == 'panstart') {
    start_x = transform.translate.x;
    start_y = transform.translate.y;
  }
  transform.translate = {
    x: start_x + ev.deltaX,
    y: start_y + ev.deltaY,
  };
  touchesActive = true;
}

// change the scale with pinch gestures
let initScale = 1;
function onPinch(ev: any) {
  if (ev.type == 'pinchstart') {
    initScale = transform.scale || 1;
  }

  transform.scale = initScale * ev.scale;
  touchesActive = true;
}

// change the rotation with rotate gestures
let initAngle = 0;
function onRotate(ev: any) {
  if (ev.type == 'rotatestart') {
    initAngle = transform.angle || 0;
  }
  transform.angle = initAngle + (ev.rotation * Math.PI) / 180;
  touchesActive = true;
}

// add listeners/handlers for gestures
mc.on('rotatestart rotatemove', onRotate);
mc.on('pinchstart pinchmove', onPinch);
mc.on('panstart panmove', onPan);

mc.on('hammer.input', function (ev) {
  // when the manager detects that all touches have ended
  if (ev.isFinal) {
    touchesActive = false;
  }
});

const img = new Image();
img.onload = () => {
  window.requestAnimationFrame(draw);
};
img.src = './assets/xbox_360.png';

const draw = () => {
  // clear the transform and the canvas
  context.resetTransform();
  context.clearRect(0, 0, WIDTH, HEIGHT);

  // move to the center of the canvas
  context.translate(WIDTH / 2, HEIGHT / 2);
  // translate based on what pan gestures have done
  context.translate(transform.translate.x, transform.translate.y);
  // scale based on what pinch gestures have done
  context.scale(transform.scale, transform.scale);
  // rotate based on what rotate gestures have done
  context.rotate(transform.angle);
  // then (finally!) draw the image (-800, -500 were chosen because the pixel is 1600x1000)
  context.drawImage(img, -800, -500);

  if (!touchesActive) {
    // transition back to the original transform characteristics when not touching
    transform.angle *= 0.98;
    transform.translate.x *= 0.98;
    transform.translate.y *= 0.98;
    transform.scale = SCALE + (transform.scale - SCALE) * 0.98;
  }

  window.requestAnimationFrame(draw);
};
