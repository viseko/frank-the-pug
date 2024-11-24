import {installClass} from "@/app/App.js";
import FieldText from "./lib/FieldText.js";
import FieldNumber from "./lib/FieldNumber.js";

installClass(".js-input", FieldText);

installClass(".js-input-phone", FieldText, {
  mask: "+7 ___ ___-__-__",
  blurValidate: true,
  minLength: 16,
  errors: {
    "minlength": "Введите номер полностью"
  }
});

installClass(".js-input-email", FieldText, {
  pattern: /.+@.+\..+/,
  blurValidate: true,
}); 

installClass(".js-input-number", FieldNumber);