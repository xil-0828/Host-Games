import { Assets } from "@drincs/pixi-vn";
import manifest from "../assets/manifest";

/**
 * Define all the assets that will be used in the game.
 * This function will be called before the game starts.
 * You can read more about assets management in the documentation: https://pixi-vn.web.app/start/assets-management.html
 */
export async function defineAssets() {
  Assets.init({ manifest });
}