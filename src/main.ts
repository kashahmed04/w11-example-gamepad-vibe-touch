import './reset.css';
import './styles.css';

//why do we have to do the ./ if its in the same src folder as main.ts**
import { getNameFromIndex, getValueFor, isPressed } from './GamepadHelper';

const text = document.querySelector('#text') as HTMLDivElement;
const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
canvas.width = 1600;
canvas.height = 1000;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

// gamepadconnected is called in two circumstances:
// 1 - when a gamepad is connected to the computer (from a disconnected state)
// 2 - when an already connected gamepad first experiences a button push or axis move

//so basically this event listener is ran when we connect a gamepad the first time or when we disconnect and connect it again as well**
//this event listener also runs when it first experiences all the controls but after the first time for each control
//it stops going to this event listener and goes**
//when was the situation where we did not need this event listener and when we needed it (one or multiple
//controllers being connected)**

// gamepadconnected is useful to know when gamepad connections happen
// but it's not necessary for the gamepad to work - navigator.getGamepads() can be called directly!(what situations
// would we need the event listener and not need the event listener)**
// navigator.getGamepads() only takes in 4 gamepads connected to one device at a time right** (slide 3)**
// is the gamepad only for PC connection or could it be mobile devices to (for bluetooth)**
// do bluetooth connections work as well or only wired connections for this**
window.addEventListener('gamepadconnected', (e) => {
  //how does it know what the index is for the controller**
  //the id is the name of the controller right**
  //what is the buttons array is it an array of all the controls or what we can do with the controls** (slide 3)**
  //what are the axis for (slide 3)**
  //go over vibration actuator** (slide 3)**
  //what are these percentages in the console.log statement**
  console.log(
    'Gamepad connected at index %d: %s. %d buttons, %d axes.',
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length,
  );
  //what does this return and how did we know the use gamepad because we did not define it anywhere is this built in
  //what does it do**
  console.log(e.gamepad);
});

// used to prevent starting vibration when already vibrating
// when the controller is vibrating don't start a new vibration until the current one is fully over**
// does this prevent the current vibration from being overridden or the vibrations building ontop of each other**
let isVibing = false;

// load the background image
const img = new Image();
img.onload = () => {
  // start drawing once the image has loaded
  // so every frame we refresh and we draw the image in the canvas and it and it goes the full
  // width of the canvas because we put 1600 which is the width of the image and for the height its**
  window.requestAnimationFrame(draw);
};

//we always put the src below the onload because it might skip the onload if we put it above the onload
//after creating the image (how)**
img.src = './assets/xbox_360.png';

// render loop
const draw = () => {
  context.clearRect(0, 0, 1600, 1000);
  context.drawImage(img, 0, 0);

  // get the current state of all gamepads
  // so this gets the state of all the buttons that are clicked and not clicked by default and its built in**
  // the navigator only accounts window right so it will show the buttons clicked on the window after it gets the buttons
  // that are clicked and not clicked**
  // what does it mean by the current state of all the gamepads**
  const gamepads = navigator.getGamepads();

  //how did we know to get the 0th index of the gamepads if we just got the state of all the gamepads in the above line**
  if (gamepads[0]) {
    displayGamepad(gamepads[0]);
  }

  // draw again next frame
  //why do we need this twice why cant we just have it in the image.onload because wouldnt it run the draw method
  //each frame from when it loads until we close the tab or refresh** or is it only once for onload when we initially start the
  //program or refresh the page then we keep repeating it here each frame**
  //here we draw the background image then call the displaygamepad to draw the button clicks or movement on joysticks
  //on the background image right**
  window.requestAnimationFrame(draw);
};

// draws a "color" circle centered at "x" and "y"
const drawButton = (x: number, y: number, color: string) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, 50, 0, Math.PI * 2);
  context.fill();
  context.stroke();
};

// draws a line starting from "cx, cy" in the direction of "dx, dy" to a distance of "max"
//cx and cy are the starting points and are dx and dy our ending points and the max is how long the line should be from
//the starting points to the ending points**
const drawAxis = (
  cx: number,
  cy: number,
  dx: number,
  dy: number,
  max: number,
) => {
  //thick white line behind the black line for joysticks and triggers (all 4 triggers or only 2)**
  context.strokeStyle = 'white';
  context.lineWidth = 20;
  context.beginPath();
  context.moveTo(cx, cy);
  context.lineTo(cx + dx * max, cy + dy * max);
  context.stroke();

  //thinner black line in front of the white line for joysticks and triggers (all 4 triggers or only 2)**
  context.strokeStyle = '#757575';
  context.lineWidth = 10;
  context.beginPath();
  context.moveTo(cx, cy);
  context.lineTo(cx + dx * max, cy + dy * max);
  context.stroke();
};

const displayGamepad = (gamepad: Gamepad) => {
  // build the text output on the left side
  const output = [];
  //how did we know what to put in the array and why did we stringify it**
  //what does everything we pass in mean**
  //go over**
  output.push(JSON.stringify(gamepad.axes, null, 2));
  output.push(
    JSON.stringify(
      gamepad.buttons.map((button, index) => {
        const buttonLabel = getNameFromIndex(index);
        return `${button.pressed ? '■' : '□'} ${buttonLabel} ${button.value}`;
      }),
      null,
      2,
    ),
  );
  //what does this do**
  text.innerText = output.join('\n');

  //why do we need a strokestyle of white 
  //with this line width if we override it when we call draw button**
  context.strokeStyle = 'white';
  context.lineWidth = 10;

  // draw circles for all the buttons
  if (isPressed(gamepad, 'A')) {
    drawButton(1270, 600, '#00ff00');
  }

  if (isPressed(gamepad, 'B')) {
    drawButton(1400, 500, '#ff0000');
  }

  if (isPressed(gamepad, 'Y')) {
    drawButton(1285, 400, '#ffff00');
  }

  if (isPressed(gamepad, 'X')) {
    drawButton(1160, 500, '#0000ff');
  }

  if (isPressed(gamepad, 'RB')) {
    drawButton(1400, 240, '#707070');
  }

  if (isPressed(gamepad, 'LB')) {
    drawButton(200, 240, '#707070');
  }
  if (isPressed(gamepad, 'D_Up')) {
    drawButton(560, 670, '#707070');
  }
  if (isPressed(gamepad, 'D_Down')) {
    drawButton(560, 850, '#707070');
  }
  if (isPressed(gamepad, 'D_Left')) {
    drawButton(460, 760, '#707070');
  }
  if (isPressed(gamepad, 'D_Right')) {
    drawButton(660, 760, '#707070');
  }
  if (isPressed(gamepad, 'Back')) {
    drawButton(620, 500, '#707070');
  }
  if (isPressed(gamepad, 'Shiny')) {
    drawButton(800, 500, '#707070');
  }
  if (isPressed(gamepad, 'Start')) {
    drawButton(980, 500, '#707070');
  }
  if (isPressed(gamepad, 'LStick')) {
    drawButton(315, 565, '#707070');
  }
  if (isPressed(gamepad, 'RStick')) {
    drawButton(1025, 800, '#707070');
  }

  // draw lines for the LStick and RStick
  //what does parameter mean and why is it not in a conditional for if we move the joysticks because
  //wouldnt it draw a line even though we don't move the joysticks**
  //what do the indexes mean and how do we know which to put**
  drawAxis(315, 565, gamepad.axes[0], gamepad.axes[1], 150);
  drawAxis(1025, 800, gamepad.axes[2], gamepad.axes[3], 150);

  // draw lines for the LT and RT
  //what does parameter mean and why is it not in a conditional for if we press the triggers because
  //wouldnt it draw a line even though we don't press the triggers**
  //this takes the current gamepad we passed into this method and gets the index for the buttons and**
  //how do we know when to get index and actual button name like we did here and above**
  drawAxis(370, 160, 0, getValueFor(gamepad, 'LT'), -130);
  drawAxis(1240, 160, 0, getValueFor(gamepad, 'RT'), -130);

  // if the A button is pressed and we're not already vibrating
  if (isPressed(gamepad, 'A') && !isVibing) {
    isVibing = true;

    // start the vibration, strength based on the trigger positions
    //go over what does weak and strong magnitude do**
    //how did we know to use getvalue (index) here instead of another method in gamepad helper**
    gamepad.vibrationActuator?.playEffect('dual-rumble', {
      startDelay: 0,
      duration: 200,
      weakMagnitude: getValueFor(gamepad, 'LT'),
      strongMagnitude: getValueFor(gamepad, 'RT'),
    });

    // stop vibing after a bit
    //we stop after 201 ms so we make sure we vibrate the full 200 ms otherwise we woud vibrate for 199 ms if we stopped
    //at 200 ms (everything in JS is in ms right)
    //for set time out how does it know to stop after 201 ms if we dont put anything in the parameter** (how do we know to put
    //something in parameter)**
    //settimeout basically just does this once instead of on an interval for setinterval
    //so we stop vibrating after 201 ms until this conditional
    //is true again then it does this again**
    //how do we know to put things in parameter for settimeout and setinterval**
    setTimeout(() => {
      isVibing = false;
    }, 201);
  }
};

/**
 * NEW NOTES:
 * 
 * for slide 5 for step 2 is that saying when we run host its not local anymore and the link can work on any machine**
 * go over steps 3 and 4 on slide 5**
 * 
 * go over slide 6**
 * 
 * whatever has a navigator. refers to the current window that is opened for the program right** (navigator will always
 * go in the beginning before the command so it will always be navigator.something)**
 * 
 * for the vibration navigator how many buzz and pauses are we allowed to give it in ms**
 * what is the minimum buzz pause sequence we can have (was it 50 for the buzz otherwise if we go lower we won't feel it
 * or it won't even work)** (slide 7)**
 * 
 * so with the last method we have to put all 0's according to the total number of entries we had in the navigator.vibrate
 * originally** or we could just put an empty array or just 0** (slide 7)**
 * 
 * so touch events are only a tap and no math is needed (because the point for tapping is built in)**
 * but for gestrues like pinching, scrolling, or moving,
 * it involves math so we can use hammer.JS (the point for gestures is not build in so we have to calculate it)**
 * so it can do the math for us when we call certain methods in the API** (slide 8)**
 * 
 * hammer.JS had a typescript version as well (is it up to date or is it an older version like how other typescript
 * API's are (or libraries or frameworks))**
 * 
 * the rotate in hammer.JS is in degrees but the canvas is in radians so we have to convert from degrees to radians before
 * doing rotation on the canvas for the controller image** (slied 8)**
 * 
 * what do all the methods do here for the start and move** (slide 8)**
 * 
 * what does the last bullet mean on slide 8**
 * 
 * 
 * 
 * 
 * 
 */
