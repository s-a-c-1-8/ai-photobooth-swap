import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartScreen from "./components/StartScreen";
import CameraCaptureScreen from "./components/CameraCaptureScreen";
import CharacterSelectionScreen from "./components/CharacterSelectionScreen";
import ResultScreen from "./components/ResultScreen";
import GenderSelectionScreen from "./components/GenderSelectionScreen";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/gender-selection" element={<GenderSelectionScreen />} />
          <Route
            path="/character-selection"
            element={<CharacterSelectionScreen />}
          />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/camera" element={<CameraCaptureScreen />} />
          <Route path="/loading" element={<LoadingScreen />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
