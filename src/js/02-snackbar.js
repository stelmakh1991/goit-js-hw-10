import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const form = document.querySelector('.form');
const submitBtn = document.querySelector('[type="submit"]');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const delay = Number(document.querySelector('[name="delay"]').value);
  const state = document.querySelector('[name="state"]:checked');

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state.value === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(delay => {
      iziToast.success({
        message: `Fulfilled promise in ${delay}ms`,
        messageColor: '#FFF',
        backgroundColor: '#59A10D',
        position: 'topRight',
        iconUrl: '../images/iconSuccess.svg',
      });
    })
    .catch(delay => {
      iziToast.error({
        message: `Rejected promise in ${delay}ms`,
        messageColor: '#FFF',
        backgroundColor: '#EF4040',
        position: 'topRight',
        iconUrl: '../images/iconClose.svg',
      });
    });
});