export default function calcVh() {
  const vh = window.innerHeight * 0.01;
  document.body.style.setProperty('--vh', `${vh}px`);

  window.addEventListener("resize", calcVh);
}


