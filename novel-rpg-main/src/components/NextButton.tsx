import { useState } from "react";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import { useQueryCanGoNext } from "../hooks/useQueryInterface";

export default function NextButton() {
  const { data: canGoNext = false } = useQueryCanGoNext();
  const [loading, setLoading] = useState(false);
  const { goNext } = useNarrationFunctions();

  if (!canGoNext) {
    return null;
  }

  return (
    <button
      onClick={() => {
        setLoading(true);
        goNext()
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
      }}
      disabled={loading}
      style={{
        width: 40,
        height: 20,
        pointerEvents: "auto",
      }}
    >
      Next
    </button>
  );
}