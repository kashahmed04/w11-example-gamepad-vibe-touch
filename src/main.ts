import './reset.css';
import './styles.css';

import { getNameFromIndex, getValueFor, isPressed } from './GamepadHelper';

const readout = document.querySelector('#readout') as HTMLDivElement;
const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
canvas.width = 1600;
canvas.height = 1000;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

// gamepadconnected is called in two circumstances:
// 1 - when a gamepad is connected to the computer (from a disconnected state)
// 2 - when an already connected gamepad first experiences a button push or axis move

// gamepadconnected is useful to know when gamepad connections happen
// but it's not necessary for the gamepad to work - navigator.getGamepads() can be called directly!
window.addEventListener('gamepadconnected', (e) => {
  console.log(
    'Gamepad connected at index %d: %s. %d buttons, %d axes.',
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length,
  );
});

// used to prevent starting vibration when already vibrating
let isVibing = false;

// load the background image
const img = new Image();
img.onload = () => {
  // start drawing once the image has loaded
  window.requestAnimationFrame(draw);
};
img.src = './assets/xbox_360.png';

// render loop
const draw = () => {
  context.clearRect(0, 0, 1600, 1000);
  context.drawImage(img, 0, 0);

  // get the current state of all gamepads
  const gamepads = navigator.getGamepads();

  if (gamepads[0]) {
    displayGamepad(gamepads[0]);
  }

  // draw again next frame
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
const drawAxis = (
  cx: number,
  cy: number,
  dx: number,
  dy: number,
  max: number,
) => {
  context.strokeStyle = 'white';
  context.lineWidth = 20;
  context.beginPath();
  context.moveTo(cx, cy);
  context.lineTo(cx + dx * max, cy + dy * max);
  context.stroke();

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
  readout.innerText = output.join('\n');

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
  drawAxis(315, 565, gamepad.axes[0], gamepad.axes[1], 150);
  drawAxis(1025, 800, gamepad.axes[2], gamepad.axes[3], 150);

  // draw lines for the LT and RT
  drawAxis(370, 160, 0, getValueFor(gamepad, 'LT'), -130);
  drawAxis(1240, 160, 0, getValueFor(gamepad, 'RT'), -130);

  // if the A button is pressed and we're not already vibrating
  if (isPressed(gamepad, 'A') && !isVibing) {
    isVibing = true;

    // start the vibration, strength based on the trigger positions
    gamepad.vibrationActuator?.playEffect('dual-rumble', {
      startDelay: 0,
      duration: 200,
      weakMagnitude: getValueFor(gamepad, 'LT'),
      strongMagnitude: getValueFor(gamepad, 'RT'),
    });

    // stop vibing after a bit
    setTimeout(() => {
      isVibing = false;
    }, 201);
  }
};
