const App = {
  modules: [],

  // Размеры для вычисления matchMedia и получения
  sizes: {
    xs: 400,
    sm: 546,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  },
  getMedia(size, mobileFirst = false) {
    const value = this.sizes[size];
    return mobileFirst
      ? matchMedia(`(min-width: ${value + 1}px)`)
      : matchMedia(`(max-width: ${value}px)`);
  },

  // Инициализация html-элемента по селектору через функцию
  install(selector, constructor, options = {}) {
    const elems = document.querySelectorAll(selector);
    if (elems.length === 0) return [];
    const initializedObjs = [];
    elems.forEach(elem => {
      initializedObjs.push(constructor(elem, options));
    });
    return initializedObjs;
  },

  // Инициализация html-элемента по селектору через класс
  installClass(selector, constructor, options = {}) {
    const elems = document.querySelectorAll(selector);
    if (elems.length === 0) return [];
    const initializedObjs = [];
    elems.forEach(elem => {
      initializedObjs.push(new constructor(elem, options));
    });
    return initializedObjs;
  },

  // Подгрузка доп. скриптов
  loadScript({ path, onload, onerror }) {
    const script = document.createElement("script");
    script.src = path;
    script.addEventListener("load", onload);
    script.addEventListener("error", () => {
      console.error(`Error loading script: ${path}`);
      if (onerror) onerror();
    });
    document.body.append(script);
  },
  
  // Запуск модулей и вынос App в глобал
  init() {
    this.modules.forEach(module => module());
    window.App = this;
  },
};

// Экспорт методов
const { install, installClass, getMedia, loadScript } = App;

export { install, installClass, getMedia, loadScript };
export default App;
