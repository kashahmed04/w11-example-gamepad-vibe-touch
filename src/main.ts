import './reset.css';
import './styles.css';

const buzz = document.querySelector('#buzz') as HTMLButtonElement;
const bounce = document.querySelector('#bounce') as HTMLButtonElement;

buzz.addEventListener('click', () => {
  // an array of timings, in milliseconds
  // [buzz, pause, buzz, pause, buzz.....]
  navigator.vibrate([
    400, 100, 200, 100, 200, 100, 500, 100, 400, 800, 400, 100, 400,
  ]);
});

bounce.addEventListener('click', () => {
  navigator.vibrate([
    200, 3200, 200, 1600, 200, 800, 200, 400, 200, 200, 150, 100, 100, 50, 50,
    50, 50, 50, 50,
  ]);
});
