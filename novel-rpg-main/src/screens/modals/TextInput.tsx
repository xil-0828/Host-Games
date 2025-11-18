import { narration } from "@drincs/pixi-vn";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { INTERFACE_DATA_USE_QUEY_KEY, useQueryDialogue, useQueryInputValue } from "../../hooks/useQueryInterface";

export default function TextInput() {
  const { data: { text } = {} } = useQueryDialogue();
  const {
    data: { isRequired: open, currentValue } = {
      currentValue: undefined,
      isRequired: false,
    },
  } = useQueryInputValue<string | number>();
  const [tempValue, setTempValue] = useState<string | number>();
  const queryClient = useQueryClient();

  return (
    <dialog
      open={open}
      style={{
        pointerEvents: "auto",
      }}
    >
      <p>{text}</p>
      {open && (
        <input
          defaultValue={currentValue || ""}
          onChange={(e) => {
            if (e && e.target && "value" in e.target) {
              let value: any = e.target.value;
              if ("type" in e.target && e.target.type === "number" && "valueAsNumber" in e.target) {
                value = e.target.valueAsNumber;
              }
              setTempValue(value);
            }
          }}
        />
      )}
      <button
        onClick={() => {
          narration.inputValue = tempValue || currentValue;
          setTempValue(undefined);
          queryClient.invalidateQueries({
            queryKey: [INTERFACE_DATA_USE_QUEY_KEY],
          });
        }}
      >
        Confirm
      </button>
    </dialog>
  );
}