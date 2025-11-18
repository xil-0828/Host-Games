import useNarrationFunctions from "../hooks/useNarrationFunctions";
import { useQueryChoiceMenuOptions } from "../hooks/useQueryInterface";

export default function ChoiceMenu() {
  const { data: menu = [] } = useQueryChoiceMenuOptions();
  const { selectChoice } = useNarrationFunctions();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "auto",
        gap: "8px",
        maxHeight: "100%",
        margin: 0,
        pointerEvents: menu?.length > 0 ? "auto" : "none",
      }}
    >
      {menu?.map((item, index) => (
        <button
          key={"choice-" + index}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => selectChoice(item)}
        >
          {item.text}
        </button>
      ))}
    </div>
  );
}