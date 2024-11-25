import { install } from "@/app/App.js";

install(".js-btn-menu", (button) => {
  button.addEventListener("click", () => {
    document.body.classList.toggle("_menu-open");
  });
});