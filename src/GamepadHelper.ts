
//why do we export button name if we don't use it in main.ts**
//what do all the pipes represent**
export type ButtonName =
  | 'A'
  | 'B'
  | 'X'
  | 'Y'
  | 'LB'
  | 'RB'
  | 'LT'
  | 'RT'
  | 'Back'
  | 'Start'
  | 'LStick'
  | 'RStick'
  | 'D_Up'
  | 'D_Down'
  | 'D_Left'
  | 'D_Right'
  | 'Shiny';

// used for getValueFor and isPressed
// (useful when we know the button name, but don't know the button index)
// when would we know the button name but not the button index**
// which button name does this take in because we have a type and array of button names**
const ButtonIndex: Record<ButtonName, number> = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  Back: 8,
  Start: 9,
  LStick: 10,
  RStick: 11,
  D_Up: 12,
  D_Down: 13,
  D_Left: 14,
  D_Right: 15,
  Shiny: 16,
};

// used for getNameFromIndex helper
// (useful when we know the index, but don't know the button name)
// when would we know the index but not the button name**
const buttonNames: ButtonName[] = [
  'A',
  'B',
  'X',
  'Y',
  'LB',
  'RB',
  'LT',
  'RT',
  'Back',
  'Start',
  'LStick',
  'RStick',
  'D_Up',
  'D_Down',
  'D_Left',
  'D_Right',
  'Shiny',
];

//how does it know which button name to use because we have the type and the array**
//what does the type and array do and how did we know to have a type and array for the button name**
//where did we define buttons that map to our controller and when we connect our controller does it know the controller and its inputs
//are equal to the gamepad type automatically for the gamepad API variable (or do we have to press all the buttons first when we
//connect out controller to map the buttons and inputs)**
//where did we define buttons in get value for function (these count as funcitons right)**
//go over all**
export const getValueFor = (gamepad: Gamepad, buttonName: ButtonName) => {
  return gamepad.buttons[ButtonIndex[buttonName]].value;
};

export const getNameFromIndex = (index: number) => {
  return buttonNames[index];
};

//how do we know which type is button name is it the type defined above or the array**
//does this get the index of the button and do the pressed how does it know which button is pressed from just an index 
//and it pressed built into the gamepad API**
export const isPressed = (gamepad: Gamepad, buttonName: ButtonName) => {
  return gamepad.buttons[ButtonIndex[buttonName]].pressed;
};
