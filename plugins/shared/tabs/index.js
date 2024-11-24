import App from "@/app/App.js";
import Swiper from "swiper";
import {EffectFade} from "swiper/modules";

App.install(".js-tabs", (tabList) => {
  // Инициализация слайдера
  const tabSwiper = new Swiper(tabList, {
    modules: [EffectFade],
    allowTouchMove: false,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    autoHeight: true
  });

  // Навигация по табам
  const id = tabList.dataset.id;
  const navigationList = document.querySelectorAll(`.js-tab-nav[data-bind="${id}"]`);
  navigationList.forEach((navElem) => {
    initTabNavigation(navElem, tabSwiper);
  });
});

function initTabNavigation(navElem, tabSwiper) {
  let currentSlide;
  const buttons = navElem.querySelectorAll("button");

  const toSlide = (index) => {
    if (currentSlide >= 0) {
      buttons[currentSlide].disabled = false;
    }

    currentSlide = index;
    buttons[index].disabled = true;
    tabSwiper.slideTo(index);
  }

  toSlide(0);

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      toSlide(index);
    })
  })
}