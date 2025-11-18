import { CharacterBaseModel, narration, stepHistory } from "@drincs/pixi-vn";
import { useQuery } from "@tanstack/react-query";

export const INTERFACE_DATA_USE_QUEY_KEY = "interface_data_use_quey_key";

const CAN_GO_BACK_USE_QUEY_KEY = "can_go_back_use_quey_key";
export function useQueryCanGoBack() {
  return useQuery({
    queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CAN_GO_BACK_USE_QUEY_KEY],
    queryFn: async () => stepHistory.canGoBack,
  });
}

const CHOICE_MENU_OPTIONS_USE_QUEY_KEY = "choice_menu_options_use_quey_key";
export function useQueryChoiceMenuOptions() {
  return useQuery({
    queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CHOICE_MENU_OPTIONS_USE_QUEY_KEY],
    queryFn: async () =>
      narration.choices?.map((option) => ({
        ...option,
        text: typeof option.text === "string" ? option.text : option.text.join(" "),
      })) || [],
  });
}

const INPUT_VALUE_USE_QUEY_KEY = "input_value_use_quey_key";
export function useQueryInputValue<T>() {
  return useQuery({
    queryKey: [INTERFACE_DATA_USE_QUEY_KEY, INPUT_VALUE_USE_QUEY_KEY],
    queryFn: async () => ({
      isRequired: narration.isRequiredInput,
      type: narration.inputType,
      currentValue: narration.inputValue as T | undefined,
    }),
  });
}

const DIALOGUE_USE_QUEY_KEY = "dialogue_use_quey_key";
export function useQueryDialogue() {
  return useQuery({
    queryKey: [INTERFACE_DATA_USE_QUEY_KEY, DIALOGUE_USE_QUEY_KEY],
    queryFn: async () => {
      let dialogue = narration.dialogue;
      let text = dialogue?.text;
      if (Array.isArray(text)) {
        text = text.join(" ");
      }
      let character = dialogue?.character as string | CharacterBaseModel | undefined;
      if (typeof character === "string") {
        character = new CharacterBaseModel(character, {
          name: character,
        });
      }

      return {
        text,
        character,
      };
    },
  });
}

const CAN_GO_NEXT_USE_QUEY_KEY = "can_go_next_use_quey_key";
export function useQueryCanGoNext() {
  return useQuery({
    queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CAN_GO_NEXT_USE_QUEY_KEY],
    queryFn: async () => narration.canGoNext && !narration.isRequiredInput,
  });
}

const NARRATIVE_HISTORY_USE_QUEY_KEY = "narrative_history_use_quey_key";
export function useQueryNarrativeHistory() {
  return useQuery({
    queryKey: [INTERFACE_DATA_USE_QUEY_KEY, NARRATIVE_HISTORY_USE_QUEY_KEY],
    queryFn: async () => {
      const promises = stepHistory.narrativeHistory.map(async (step) => {
        let character = step.dialogue?.character as string | CharacterBaseModel | undefined;
        if (typeof character === "string") {
          character = new CharacterBaseModel(character, { name: character });
        }
        let text = step.dialogue?.text;
        if (Array.isArray(text)) {
          text = text.join(" ");
        }
        return {
          character: character?.name ? character.name + (character.surname ? " " + character.surname : "") : undefined,
          text: text || "",
          icon: character?.icon,
          choices: step.choices,
          inputValue: step.inputValue,
        };
      });
      return await Promise.all(promises);
    },
  });
}