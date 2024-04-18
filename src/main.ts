import './reset.css';
import './styles.css';

//why do we have to do the ./ if its in the same src folder as main.ts**
import { getNameFromIndex, getValueFor, isPressed } from './GamepadHelper';

const text = document.querySelector('#text') as HTMLDivElement; //why did we put div here instead of span how does this work**
const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
canvas.width = 1600;
canvas.height = 1000;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

// gamepadconnected is called in two circumstances:
// 1 - when a gamepad is connected to the computer (from a disconnected state)
// 2 - when an already connected gamepad first experiences a button push or axis move

//so basically this event listener is ran when we connect a gamepad the first time or when we disconnect and connect it again as well**
//this event listener also runs when it first experiences all the controls but after the first time for each control
//it stops going to this event listener and goes to**
//when was the situation where we did not need this event listener and when we needed it (one or multiple
//controllers being connected)**

// gamepadconnected is useful to know when gamepad connections happen
// but it's not necessary for the gamepad to work - navigator.getGamepads() can be called directly! (where and how)**
// (what situations would we need the event listener and not need the event listener)**
// navigator.getGamepads() only takes in 4 gamepads connected to one device at a time right** (slide 3)**
// is the gamepad only for PC connection or could it be mobile devices to (for bluetooth)**
// do bluetooth connections work as well or only wired connections for this**
window.addEventListener('gamepadconnected', (e) => {
  //how does it know what the index is for the controller**
  //the id is the name of the controller or controlllers we connect right** (if we have multiple controllers would there be 
  //multiple of these console.log for each controller for the event listener or only 1 with all the information in it 
  //for each controller)**
  //what is the buttons array is it an array of all the controls or what we can do with the controls** (slide 3)**
  //what are the axis and they are only for the joysticks or for the triggers as well (slide 3)**
  //go over vibration actuator what does it mean by non-standard** (slide 3)**
  //what are these percentages in the console.log statement**
  //how did we know to use e.gamepad here didnt we have to define gamepad was type of gamepad how does it work**
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
  window.requestAnimationFrame(draw);
};

//we always put the src below the onload because it might skip the onload if we put it above the onload
//after creating the image (how)**
img.src = './assets/xbox_360.png';

// render loop
const draw = () => {
  context.clearRect(0, 0, 1600, 1000);
  
  // so every frame we refresh and we draw the image in the canvas and it and it goes the full
  // width of the canvas because we put 1600 which is the width of the image and for the height its 1000
  // and we start at (0,0) to start drawing the image on the top left to the full canvas bounds which is the whole image size**
  //the canvas units are in pixels by default right and we cant change it**
  context.drawImage(img, 0, 0);

  // get the current state of all gamepads
  // so this gets the state of all the buttons that are clicked and not clicked by default and its built in for gamepad API**
  // do we not have to define we are using the gamepad API in the beginning of our code or any API we can just use it 
  // (we had to define things in the start for babylon.JS and three.JS though)**
  // the navigator only accounts window right so it will show the buttons clicked on the current window with
  // this application open after it gets the buttons that are clicked and not clicked**
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
  //could we have just said draw() in the image.onload if it only gets called once**
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
      startDelay: 0, //what does this do**
      duration: 200,
      weakMagnitude: getValueFor(gamepad, 'LT'),
      strongMagnitude: getValueFor(gamepad, 'RT'),
    });

    // stop vibing after a bit
    //we stop after 201 ms so we make sure we vibrate the full 200 ms otherwise we woud vibrate for 199 ms if we stopped
    //at 200 ms (everything in JS is in ms right)**
    //for set time out how does it know to stop after 201 ms if we dont put anything in the parameter** (how do we know to put
    //something in parameter)**
    //settimeout basically just does this once instead of on an interval for setinterval
    //so we stop vibrating after 201 ms until this conditional
    //is true again then it does this again**
    //how do we know to put things in parameter for settimeout and setinterval**
    //what f we used setinterval instead**
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
 * does CSS also take only radians as well so we have to convert from degrees to radians for hammer.JS (slide 8 last bullet)**
 * 
 * how would we apply a certain gesture from JS into CSS if the value is in JS (slide 8 last bullet)**
 * 
 * for a framework if it already had something in the library we use with it does it override whats in the framework
 * (Ex. using next.JS with react for a rendering layer so it overrrides next.JS rednering layer and replaces if with
 * react)**
 * 
 * go over slide 5 on pip slides**
 * 
 * go over slide 6 on pip slides**
 * 
 * for slides 8-10 do we only change the package.JSON line and where specifically do we change it 
 * compared to the original line and we just run the build again right no other npm commands**
 * 
 * for slides 11-12 vite only can build one HTML file (by default its index.html) by default when we build
 * if we have multiple html files we go to the vite.config.js file in our src and just add all the html files we want to
 * include in our build and the ones we don't put in there will not get included in the build**
 * 
 * if we don't specify a main as index.html does it do it by default or what does it put as the main**
 * 
 * can the key** before the : be any word or does it have to match our html file name like for dvd**
 * after we do this we can just rerun the build as well and there is no extra commands right**
 * 
 * why did we use image tag in index.html then a svg inline tag for dvd.html is it because we wanted to edit our 
 * other windows svg image thats why we made it inline for dvd.html but for the main html window we did not want to edit the image
 * so thats why we made it an image tag**
 * 
 * I thought current color was used with text color so why did we use just color: in the JS to apply our color in the dvd.html
 * for current color is it because color: represents text color and that can be only used to change the current color
 * on a style element**
 * 
 * why did we use fill with the current color on the path element I thought it would 
 * have been a style on the path element or is it included in the path element by default as an attribute (in the HTML path tag)**
 * 
 *   getWindow: () => { //why do we return a method here and not just proxy**** (or is this not a method what is this)****
      //difference between this and a method****
      return proxy;
    },

    for dvd.ts**


    x = Math.floor(min_x + Math.random() * (max_x - min_x));
    y = Math.floor(min_y + Math.random() * (max_y - min_y));
    x = x + dx * deltaTimeSeconds;
    y = y + dy * deltaTimeSeconds;
    //so we make x and y initially to make the window size for each window when we open it
    // then we override it with the rate it should move
    //at per frame (how does that work)****
    //is it because we first define the window size when we make a dvd in initwindow() and we don't need it anymore and we can just
    override it with a step value now for each frame**

    //when we call drivewindows we get a timestamp for free (is the timestamp as soon as the browser
    //starts (when the browser is finished loading in or when the browser is opened)** and it starts counting up in ms)****
    window.requestAnimationFrame(driveWindows);

      //this will always be positive becase timestamp will always be larger than previoustimestamp**
      const elapsed = timeStamp - previousTimeStamp;

    go over pip code if time**

    
 * 
 * so a JS closure is when we use let and const inside of a class just like a function and its locally scoped but we can return
 * certain aspects we want to be known to other files or things outside of the class whereas with functions we can't**
 * so a function counts as a JS closure right since the variables are locally (block) scoped in the method right**
 * what is a JS closure how is it different from a variable being block scoped**
 * only let and const are used in JS closures right not var** 
 * 
 * 
 * 
 * 
 * the axes in the gamepad object is just for the joysticks and the triggers are floats in the buttons array 
 * (1 when fully pressed and 0 when not pressed for all buttons but triggers can also be in between 0 and 1 as a float)
 * buttons is the properties on the gamepad button object for each button (pressed is boolean if pressed or not same
 * for touched and it also returns a boolean and the value is 0 or 1 or decimal value for the triggers)
 * some buttons can detect touch (are we resting finger on button without pressing it) this is what touched it for 
 * for the buttons
 * vibration actuator (non standard means its not agreed upon for all browsers on how to use it)(some browsers may use it or may
 * have conflicting ideas on the vibration)(depends on the browser)(haptic actuator is firefox and vibation actuator is everything
 * else)
 * 
 * if there is nothing in the array after we do navigaor.getgamepads() then everything is null but if we have 1 gamepad
 * then we say the 0th entry to use that controller (if we had more gamepads we would have this conditonal written for each
 * gamepad)
 * 
 *  // get the current state of all gamepads
  const gamepads = navigator.getGamepads();

  if (gamepads[0]) {
    displayGamepad(gamepads[0]);
  }

  // draw again next frame
  window.requestAnimationFrame(draw);
};

 * 
 * for the vibration for the array it varies by browser for the length of the array and if we exceed that limit it just
 * stops vibrating at it's limit (the array gets truncated)
 * when we cancel the vibration out for the last array with the [0,0,0,0,....] (we can even pass in an array with one
 * zero ([0]) and it would work and does not have to match the amount of entries in the vibration array)
 * 
 * for touch we have a coorindate for us but for gestures we need to do math to compare each point with each other
 * for a gesture to figure out what gesture we are doing 
 * 
 * we can do gestures together and panstart and panend allows us to move without pinching or rotating but we can mix
 * and do different gestures
 * 
 * hammerJS is in degrees and we need to convert the angle to radians to apply it to the canvas because the canvas is in radians
 * how do we achieve the pan and zoom effect in our applicaiton for last bullet on slide 8 for touch events hammerJS
 * gives us the angles and the translate and scales (transforms) and we use CSS or canvas to apply these to our objects in the browser
 * 
 * we look for pinches and look for pan and rotate as well
 * new Hammer.Pinch({ threshold: 0 }).recognizeWith([
    mc.get('pan'),
    mc.get('rotate'),
  ]),
 * 
 */
