import {install} from "@/app/App.js";

const PARAMS = {
  className: ".js-youtube",
  btnPlay: ".youtube__play"
};

install(PARAMS.className, init);

function init(elem) {
  const youtubeID = elem.dataset.id;
  const imgSrc = `https://i.ytimg.com/vi/${youtubeID}/maxresdefault.jpg`;
  const btn = elem.querySelector(PARAMS.btnPlay);
  const start = elem.dataset.start || 0;

  elem.style.backgroundImage = `url(${imgSrc})`;

  btn.addEventListener("click", function(event) {
    event.preventDefault();
    insertVideo(youtubeID, elem, start);
  });
}

function insertVideo(id, elem, start) {
  const iframe = document.createElement("iframe");
  iframe.width="100%";
    iframe.height="100%";
  iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.setAttribute("allowfullscreen", true);

  iframe.src=`https://www.youtube.com/embed/${id}?start=${start}&modestbranding=1&autoplay=1&rel=0&hd=1&vq=hd720&enablejsapi=1`;

  elem.append(iframe);
  elem.classList.add("_play");
}

export default init;