import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import iconClose from '../img/iconClose.svg';

const startButton = document.querySelector('button[data-start]');
const dataDay = document.querySelector('span[data-days]');
const dataHours = document.querySelector('span[data-hours]');
const dataMinutes = document.querySelector('span[data-minutes]');
const dataSeconds = document.querySelector('span[data-seconds]');
const dataPicker = document.querySelector('#datetime-picker');

// встановлення дефолтниих активних станів для кнопки та інпута при перезавантаженні
dataPicker.disabled = false;
dataPicker.classList.toggle('is-active');
startButton.disabled = true;

let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate < Date.now()) {
        iziToast.show({
        title: 'Erorr',
        titleColor: '#fff',
        titleSize: '16px',
        titleLineHeight: '1.5',
        message: 'Please choose a date in the future',
        messageColor: '#FFF',
        messageSize: '16px',
        messageLineHeight: '1.5',
        backgroundColor: '#EF4040',
        position: 'topRight',
        iconUrl: iconClose,
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);


class Timer {
  constructor(tick) {
    this.tick = tick;
    this.isActive = false;
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    const initTime = userSelectedDate;

    this.intervalId = setInterval(() => {
      const diff = initTime - Date.now();
      if (diff <= 0) { clearInterval(this.intervalId); } 
      else {
        const timeObj = this.convertMs(diff); 
        this.tick(timeObj);
      } 
    }, 1000)
  }

  convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
}

const timer = new Timer(tick);

startButton.addEventListener('click', () => {
  timer.start();
  dataPicker.disabled = true;
  // Додаткове відключення подій курсора на інпуті для кращої видимості, що інпут неактивний
  dataPicker.classList.toggle('is-active');
  startButton.disabled = true;
})

function tick({ days, hours, minutes, seconds }) {
  const day = `${addZero(days)}`;
  const hrs = `${addZero(hours)}`;
  const min = `${addZero(minutes)}`;
  const sec = `${addZero(seconds)}`;

  dataDay.textContent = day;
  dataHours.textContent = hrs;
  dataMinutes.textContent = min;
  dataSeconds.textContent = sec;
}

function addZero(num) {
  return num.toString().padStart(2, '0');
}

