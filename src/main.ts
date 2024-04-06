import './reset.css';
import './styles.css';

import 'hammerjs';

// scale the canvas based on the window viewport
//how did we know to do innerwidth and height what about outer widith and height (is there not width
//or height in general for the window element)**
//whenever we just say window. that refers to our current window by default right we don't need to assign it anything**
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// the image is 1600px wide, figure out what the scale should be to make it fit the width
// how did we know to do this math here**
const SCALE = (WIDTH - 20) / 1600;

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
canvas.width = WIDTH;
canvas.height = HEIGHT;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

// initialize the Hammer manager
//what does this do**
//do we have to initialize this everytime we use the hammer API**
const mc = new Hammer.Manager(canvas);

// start tracking Pan, Rotate, Pinch gestures
// what do these do**
// what does pan do (move around without pinching or rotating or)**
mc.add(new Hammer.Pan({ threshold: 0 }));
mc.add(new Hammer.Rotate({ threshold: 0 }).recognizeWith([mc.get('pan')]));
mc.add(
  new Hammer.Pinch({ threshold: 0 }).recognizeWith([
    mc.get('pan'),
    mc.get('rotate'),
  ]),
);

// track the transform values to be used when drawing**
// what does each variable represent (are they used in pan, rotate, and pinch for all or only some of them)**
let transform = {
  scale: SCALE,
  angle: 0,
  translate: {
    x: 0,
    y: 0,
  },
};

//are these for a combination of all the types of touches we can have or only one at a time (for pan, rotate, and pinch)**
let touchesActive = false;

// change the translate x and y with pan gestures (what are pan gestures)**
// is it multiple fingers to move instead of 1 for just touch)**
let start_x = 0;
let start_y = 0;
//go over**
//is ev.type built into hammer.JS or into JS and the events after the equals sign as well**
function onPan(ev: any) {
  if (ev.type == 'panstart') {
    //we get the current value stored in the transform object for translate (it starts off as 0 though so why is this here)** 
    //as we keep changing our position it gets stored in the transform object
    //and we can call it here to change our values for movement**
    start_x = transform.translate.x;
    start_y = transform.translate.y;
  }
  transform.translate = {
    //replace the x and y for translate in the transform object**
    //how does the event have a deltaX and deltaY is it built into JS or hammer.JS**
    x: start_x + ev.deltaX,
    y: start_y + ev.deltaY,
  };
  //does this ony apply for one touch event or multiple**
  touchesActive = true;
}

// change the scale with pinch gestures
// why do we need a scale if we have one in the transform object**
let initScale = 1;
function onPinch(ev: any) {
  if (ev.type == 'pinchstart') {
    //we change the scale to whatever the transform object currently has which is**
    //then we move on when we pinch we will get different values because we store the current value in the object
    //for scale**
    initScale = transform.scale || 1;
  }

  //we change our scale when we pinch by the event scale which is** (built into JS or hammer.JS)**
  transform.scale = initScale * ev.scale;
  //does this apply to one or multiple touch events**
  touchesActive = true;
}

// change the rotation with rotate gestures
//go over**
let initAngle = 0;
function onRotate(ev: any) {
  //is the event type build into JS or hammer.JS**
  if (ev.type == 'rotatestart') {
    //get the angle from the transform object that we stored in for our current roation (initialially 0)**
    initAngle = transform.angle || 0;
  }
  //we store our current angle in our transform object** is the event.rotation built into JS or hammer.JS**
  //why did we divide by 180 here and not 360 for a full circle**
  transform.angle = initAngle + (ev.rotation * Math.PI) / 180;
  touchesActive = true;
}

// add listeners/handlers for gestures
// are these built into hammer.JS and thats why we can use these events in quotes for when we start and when
// we are doing an action** (do we usually put it as a string)**
mc.on('rotatestart rotatemove', onRotate);
mc.on('pinchstart pinchmove', onPinch);
mc.on('panstart panmove', onPan);

//what does the hammer.input say and when do we use it**
//why did we use a function like this instead of an arrow function (does it matter with hammer.JS)**
mc.on('hammer.input', function (ev) {
  // when the manager detects that all touches have ended
  //is this event built into JS or hammer.JS and when do we know when to use it**
  //what does the isFinal actually checking for**
  if (ev.isFinal) {
    touchesActive = false;
  }
});

const img = new Image();
img.onload = () => {
  window.requestAnimationFrame(draw);
};
img.src = './assets/xbox_360.png';

//go over all**
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
  // why did we choose this location for the image** (how does it know what width and height to draw the image in)**
  context.drawImage(img, -800, -500);

  if (!touchesActive) {
    // transition back to the original transform characteristics when not touching
    //so basically each frame it redraws the image and checks if there are no touches then resets all the fields in the 
    //transform object to whatever they originally were without any movement** (how did we know to scale by these values to go back
    //in the original position before we moved anything)**
    //so basically the touch events dont remain once we stop touching the screen and everything goes back to how it was
    //initially**
    transform.angle *= 0.98;
    transform.translate.x *= 0.98;
    transform.translate.y *= 0.98;
    transform.scale = SCALE + (transform.scale - SCALE) * 0.98;
  }

  //this draws everything with all the touch events applied each frame as well as a check if there are no events to reset everything**
  //the requestanimationframe in the onload was only called once for when the image loads but this keeps it running over
  //and over each frame**
  //if the requestaniamtionframe in onload only runs once how come we could have not just called draw() instead of a 
  //requestanimationframe**
  window.requestAnimationFrame(draw);
};
