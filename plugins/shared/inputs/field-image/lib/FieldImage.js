export default class FieldImage {
  constructor(elem) {
    const input = elem.querySelector("[type='file']");
    const preview = elem.querySelector("[data-role='preview']");

    input.addEventListener("change", function() {
      changeHandler(this, preview);
    });
  }
}

function changeHandler(elem, preview) {
  const file = elem.files[0];

  preview.innerHTML = "";
  
  if (file.type.includes("image/")) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    preview.append(img);
  }
}