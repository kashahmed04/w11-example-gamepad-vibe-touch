import './reset.css';
import './styles.css';

const buzz = document.querySelector('#buzz') as HTMLButtonElement;
const bounce = document.querySelector('#bounce') as HTMLButtonElement;
//what does bounce do in comparison to buzz because they both set vibrations**

buzz.addEventListener('click', () => {
  // an array of timings, in milliseconds
  // [buzz, pause, buzz, pause, buzz.....]
  // is there a limit for how many buzz and pause we can have**
  navigator.vibrate([
    400, 100, 200, 100, 200, 100, 500, 100, 400, 800, 400, 100, 400,
  ]);
});

//does this make the vibration get less and less gradually how does it do that for the first one or is it just
//random buzzing and any rate**
bounce.addEventListener('click', () => {
  navigator.vibrate([
    200, 3200, 200, 1600, 200, 800, 200, 400, 200, 200, 150, 100, 100, 50, 50,
    50, 50, 50, 50,
  ]);
});

//gamepadhelper remains the same in all files right**