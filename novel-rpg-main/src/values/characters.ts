import { CharacterBaseModel, RegisteredCharacters } from "@drincs/pixi-vn";

export const mc = new CharacterBaseModel("mc", {
  name: "Me",
});

export const james = new CharacterBaseModel("james", {
  name: "James",
  color: "#0084ac",
});

export const steph = new CharacterBaseModel("steph", {
  name: "Steph",
  color: "#ac5900",
});

export const sly = new CharacterBaseModel("sly", {
  name: "Sly",
  color: "#6d00ac",
});

RegisteredCharacters.add([mc, james, steph, sly]);