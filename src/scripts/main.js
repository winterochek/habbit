'use strict';

let habbits = []; // объявляем переменную в глобальной области видимости
const HABBIT_KEY = 'HABBIT_KEY';

const page = {
   menu: document.querySelector('.menu'),
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

// Start of app
(() => {
   loadData();
   console.log(habbits); // выводим содержимое переменной habbits в консоль
})();

// Render

function reRenderMenu(activeHabbit) {
   if (!activeHabbit) return;
   for (let habbit of habbits) {
      let existed = document.querySelector(`[menu-habbit-id=${habbit.id}]`);
      if (!existed) {
         const element = document.createElement('button');
         element.setAttribute('menu-habbit-id', habbit.id);
         element.classList.add('menu__item');
         element.innerHTML = `<img src="/src/images/${habbit.icon}.svg" alt='${habbit.name}'>`;
         if (activeHabbit.id === habbit.id) {
            existed.classList.add('menu__item_active');
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

function reRender(activeHabbitId) {
   const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
   reRenderMenu(activeHabbit);
}
