'use strict';

let habbits = []; // объявляем переменную в глобальной области видимости
const HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbitId;
let popupVisible = false;
window.deleteDay = deleteDay;
window.togglePopup = togglePopup;
window.setIcon = setIcon;
window.addHabbit = addHabbit;

const page = {
   menu: document.querySelector('.menu'),
   header: {
      h1: document.getElementById('h1'),
      progress: document.querySelector('.progress__percentage'),
      bar: document.querySelector('.progress__cover-bar'),
   },
   main: {
      daysList: document.getElementById('days'),
      nextDay: document.querySelector('.new__day_title'),
   },
   form: document.getElementById('form'),
   label: document.getElementById('input__wrapper'),
   popup: {
      index: document.querySelector('.cover'),
      iconField: document.getElementById('inputField'),
   },
};

// utilities

function loadData() {
   const data = JSON.parse(localStorage.getItem(HABBIT_KEY));
   if (Array.isArray(data)) {
      habbits = data;
   }
}

function saveData() {
   localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function deleteDay(dayIndex) {
   habbits = habbits.map((h) => {
      if (h.id !== globalActiveHabbitId) return h;
      return {
         ...h,
         days: h.days.filter((_, i) => i !== dayIndex),
      };
   });
   saveData();
   rerender(globalActiveHabbitId);
}

// Render

function rerenderMenu(activeHabbit) {
   for (const habbit of habbits) {
      const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
      if (!existed) {
         const element = document.createElement('button');
         element.setAttribute('menu-habbit-id', habbit.id);
         element.classList.add('menu__item');
         element.addEventListener('click', () => rerender(habbit.id));
         element.innerHTML = `<img src="/src/images/${habbit.icon}.svg" alt="${habbit.name}" />`;
         if (activeHabbit.id === habbit.id) {
            element.classList.add('menu__item_active');
         }
         page.menu.appendChild(element);
         continue;
      }
      if (activeHabbit.id === habbit.id) {
         existed.classList.add('menu__item_active');
      } else {
         existed.classList.remove('menu__item_active');
      }
   }
}

function rerenderHead(activeHabbit) {
   page.header.h1.innerText = activeHabbit.name;
   const result = (
      (activeHabbit.days.length / activeHabbit.target) *
      100
   ).toFixed(0);
   page.header.progress.innerText = `${result > 100 ? 100 : result}%`;
   page.header.bar.setAttribute('style', `width: ${result}%`);
}

function rerenderBody(activeHabbit) {
   page.main.daysList.innerHTML = '';
   for (let i in activeHabbit.days) {
      const element = document.createElement('div');
      element.classList.add('day');
      element.innerHTML = `<div class="day__title">День ${+i + 1}</div>
      <div class="day__description">${activeHabbit.days[i].comment}</div>
      <div class="day__delete">
        <img onclick="deleteDay(${i})" src="/src/images/delete.svg" alt="delete ${
         i + 1
      } day">
      </div>`;
      page.main.daysList.appendChild(element);
   }
   page.main.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
   globalActiveHabbitId = activeHabbitId;
   const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
   if (!activeHabbit) {
      return;
   }
   document.location.replace(document.location.pathname + '#' + activeHabbitId);
   rerenderMenu(activeHabbit);
   rerenderHead(activeHabbit);
   rerenderBody(activeHabbit);
}

function addDays(event) {
   event.preventDefault();
   const form = event.target;
   const input = form['comment'];
   const comment = new FormData(form).get('comment');
   page.label.classList.remove('input_wrapper_error');
   input.placeholder = 'Комментарий';

   if (!comment) {
      page.label.classList.add('input_wrapper_error');
      input.placeholder = 'Вы не ввели текст';
      return;
   }
   habbits = habbits.map((h) => {
      if (h.id !== globalActiveHabbitId) return h;
      return {
         ...h,
         days: h.days.concat([{ comment }]),
      };
   });
   input.value = '';
   saveData();
   rerender(globalActiveHabbitId);
}

function addHabbit(event) {
   event.preventDefault();
   const form = event.target;
   const nameInput = form['name'];
   const targetInput = form['target'];
   const iconInput = form['icon'];
   const habbitName = new FormData(form).get('name');
   const habbitGoal = new FormData(form).get('target');
   const habbitIcon = new FormData(form).get('icon');

   if (!habbitGoal || !habbitName) {
      if (!habbitName) {
         nameInput.placeholder = 'Вы не ввели название';
         nameInput.classList.add('input_error');
      }
      if (!habbitGoal) {
         targetInput.placeholder = 'Вы не ввели цель';
         targetInput.classList.add('input_error');
      }
      return;
   }
   console.log(habbitName, habbitGoal, habbitIcon);
   const maxId = habbits.reduce((acc, val) => (acc > val.id ? acc : val.id), 0);
   habbits.push({
      id: maxId + 1,
      icon: habbitIcon,
      name: habbitName,
      target: habbitGoal,
      days: [],
   });
   togglePopup();
   saveData();
   rerender(maxId + 1);
}

function togglePopup() {
   if (!popupVisible) {
      page.popup.index.classList.remove('cover_hidden');
   } else {
      page.popup.index.classList.add('cover_hidden');
   }
   popupVisible = !popupVisible;
   rerender(globalActiveHabbitId);
}

function setIcon(context, icon) {
   page.popup.iconField.value = icon;
   const prevActiveIcon = document.querySelector('.icon_active');
   prevActiveIcon.classList.remove('icon_active');
   context.classList.add('icon_active');
}

(() => {
   loadData();
   page.form.addEventListener('submit', addDays);
   const hashId = Number(document.location.hash.replace('#', ''));
   const active = habbits.find((h) => h.id === hashId);

   if (active) {
      rerender(active.id);
   } else {
      rerender(habbits[0].id);
   }
})();
