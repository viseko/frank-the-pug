// ========== Адаптивное перемещение элементов ===========
// 1. Задаём "data-am" атрибут HTML элементу
// 2. Шаблон атрибута:
//      <targetElementSelector> / <mediaQuery>
// .......
// Пример: data-data-adaptive-move=".block1 / (min-width: 750px) and (max-width: 1000px)"
// .......
// При входе в медиа-запрос элемент помещается в целевой блок
// При выходе - возвращается на исходную позицию

export default function adaptiveMove() {
  const adaptiveMoveElems = document.querySelectorAll("[data-adaptive-move]");
  const queries = {};

  adaptiveMoveElems.forEach(elem => {
    const [target, mediaQuery] = elem.dataset.adaptiveMove.split("/").map(str => str.trim());
    const moveData = {
      elem,
      parent: elem.parentElement,
      target,
      prev: elem.previousElementSibling,
      index: Array.prototype.indexOf.call(elem.parentElement.children, elem)
    };
    if (queries[mediaQuery]) {
      queries[mediaQuery].push(moveData);
    } else {
      queries[mediaQuery] = [moveData];
    }
  });

  Object.keys(queries).forEach(query => {
    const mediaQuery = window.matchMedia(query);
    const queryData = queries[query];

    const matchMedia = () => {
      if (mediaQuery.matches) {
        queryData.forEach(({ elem, target }) => {
          const targetElem = document.querySelector(target);
          targetElem?.appendChild(elem);
        });
      } else {
        queryData.forEach(({ elem, parent, prev, index }) => {
          if (prev) {
            prev.insertAdjacentElement("afterend", elem);
          } else if (index === 0) {
            parent.insertBefore(elem, parent.firstChild);
          } else {
            parent.children[index - 1].insertAdjacentElement("afterend", elem);
          }
        });
      }
    };

    matchMedia();
    mediaQuery.addEventListener("change", matchMedia);
  });
}
