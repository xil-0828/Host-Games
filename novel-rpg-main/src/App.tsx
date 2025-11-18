
import NextButton from "./components/NextButton";
import TextInput from "./screens/modals/TextInput";
import NarrationScreen from "./screens/NarrationScreen";

export default function App() {
  return (
    <div>
      <NarrationScreen />
      <TextInput />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "70%",
          width: 40,
        }}
      >
        <NextButton />
      </div>
    </div>
  );
}
