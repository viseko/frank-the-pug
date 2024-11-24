import {installClass} from "@/app/App.js";
import FieldPassword from "./FieldPassword.js";

installClass(".js-input-password", FieldPassword, {
  blurValidate: true
});