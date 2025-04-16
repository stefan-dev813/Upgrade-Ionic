import checkbox from "./inputs/MUICheckbox";
import date from "./inputs/MUIDate";
import hidden from "./inputs/MUIText";
import number from "./inputs/MUIText";
import radioGroup from "./inputs/MUIRadioGroup";
import select from "./inputs/MUISelect";
import label from "./inputs/MUIStatic";
import text from "./inputs/MUIText";
import textarea from "./inputs/MUIText";
import time from "./inputs/MUITime";
import toggle from "./inputs/MUIToggle";
import autocomplete from "./inputs/MUIAutoComplete";
import filteredSelect from "./inputs/MUIFilteredSelect";

const types = {
  "checkbox": checkbox,
  "date": date,
  "hidden": hidden,
  "number": number,
  "radioGroup": radioGroup,
  "select": select,
  "label": label,
  "text": text,
  "textarea": textarea,
  "time": time,
  "toggle": toggle,
  "autocomplete": autocomplete,
  "filteredSelect": filteredSelect,
  "static": label
}

const install = function (InputTypes) {
  Object.keys(types).forEach((type) => {
    InputTypes.setInputType(type, types[type]);
  });
}

export default {
  types,
  install
}