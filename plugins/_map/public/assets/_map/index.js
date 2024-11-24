const MAP = {
  ROOT: document.querySelector(".js-ui-kit"),
  MENU_BUTTON: document.querySelector(".ui-kit__aside-button"),
  SECTIONS: document.querySelectorAll(".ui-kit__main > section"),
  MENU_LIST: document.querySelector(".ui-kit__aside-inner"),
  SECTION_TITLE: document.querySelector(".ui-kit__title"),
  OVERLAY: document.querySelector(".ui-kit__overlay"),
  currentSection: null,
  links: new Map(),
  activeLink: null,

  init() {
    this.buildMenu();
    this.MENU_BUTTON.addEventListener("click", this.toggleMenu.bind(this));
    this.OVERLAY.addEventListener("click", this.toggleMenu.bind(this));

    const hash = location.hash;
    if (hash) {
      this.hashChangeHandler(hash);
    } else {
      this.openSection(this.SECTIONS[0]);
    }

    window.addEventListener("hashchange", () => {
      const hash = location.hash;
      hash && this.hashChangeHandler(hash);
    });
  },

  toggleMenu() {
    this.ROOT.classList.toggle("_aside-open");
  },

  buildMenu() {
    const groupClass = "ui-kit__aside-group";
    const groupTitleClass = "ui-kit__aside-title";
    const linkClass = "ui-kit__aside-item";

    const groups = [...this.SECTIONS].reduce((groups, section) => {
      const groupName = section.dataset.group;
      if (groups[groupName]) {
        groups[groupName].push(section);
      } else {
        groups[groupName] = [section];
      }
      return groups;
    }, {});

    for (let groupName in groups) {
      const groupElem = document.createElement("div");
      groupElem.className = groupClass;
      const titleElem = document.createElement("div");
      titleElem.className = groupTitleClass;
      titleElem.innerHTML = groupName;
      groupElem.append(titleElem);
    
      const sections = groups[groupName];
      sections.forEach(section => {
        const link = document.createElement("a");
        link.className = linkClass;
        link.innerHTML = section.dataset.name;
        link.href = "#" + section.id;
        groupElem.append(link);
        this.links.set(section.id, link);

        link.addEventListener("click", this.linkHandler.bind(this));
      });
    
      this.MENU_LIST.append(groupElem);
    }
  },

  openSection(section) {
    // * отображаем целевую секцию
    this.currentSection && (this.currentSection.style.display = null);
    section.style.display = "block";
    this.currentSection = section;

    // * подсвечиваем активную ссылку
    const id = section.id;
    const targetLink = this.links.get(id);

    this.activeLink && (this.activeLink.classList.remove("_active"));
    targetLink && (targetLink.classList.add("_active"));
    this.activeLink = targetLink;

    // * Отображаем заголовок секции
    this.SECTION_TITLE.innerHTML = section.dataset.name;

    // * Меняем текст в адресной строке
    history.replaceState({}, section.dataset.name, location.origin + location.pathname + "#" + id);
  },

  linkHandler(event) {
    event.preventDefault();
    const hash = event.target.hash;
    const targetSection = document.querySelector(hash);
    this.openSection(targetSection);
  },

  hashChangeHandler(hash) {
    const target = document.querySelector(hash);
    target && this.openSection(target);
  }
}

MAP.init();
