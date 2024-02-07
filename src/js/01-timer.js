import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('button[data-start]');
const dataDay = document.querySelector('span[data-days]');
const dataHours = document.querySelector('span[data-hours]');
const dataMinutes = document.querySelector('span[data-minutes]');
const dataSeconds = document.querySelector('span[data-seconds]');
const dataPicker = document.querySelector('#datetime-picker');

dataPicker.disabled = false;
dataPicker.classList.toggle('is-active');
startButton.disabled = true;

let userSelectedDate;
let difference;
let timerInterval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    difference = userSelectedDate.getTime() - Date.now();
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
        iconUrl: '../images/iconClose.svg',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function onTimer(difference) {
  const timer = convertMs(difference);
  dataDay.textContent = `${addLeadingZero(timer.days)}`;
  dataHours.textContent = `${addLeadingZero(timer.hours)}`;
  dataMinutes.textContent = `${addLeadingZero(timer.minutes)}`;
  dataSeconds.textContent = `${addLeadingZero(timer.seconds)}`;
}

function onStart() {
  if (userSelectedDate > Date.now()) {
    difference = userSelectedDate.getTime() - Date.now();
    timerInterval = setInterval(() => {
      if (difference <= 0) {
        clearInterval(timerInterval);
      } else {
        onTimer(difference);
        difference -= 1000;
      }
    }, 1000);
  } else {
    iziToast.show({
      message: 'Please choose a date in the future',
      messageColor: '#FFF',
      backgroundColor: '#EF4040',
      position: 'topRight',
      iconUrl: null,
    });
  }
}

flatpickr('#datetime-picker', options);

startButton.addEventListener('click', () => {
  if (userSelectedDate > Date.now()) {
    onStart();
      startButton.disabled = true;
      dataPicker.disabled = true;
      dataPicker.classList.toggle('is-active');
  } else {
    iziToast.show({
      message: 'Please choose a date in the future',
      messageColor: '#FFF',
      backgroundColor: '#EF4040',
      position: 'topRight',
      icon: null,
    });
  }
});