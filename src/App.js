import "./App.css";
import Camera from "./Camera";

function App() {
  return (
    <div className="App">
      <Camera />
      <input type="file" id="camera" name="camera" />
    </div>
  );
}

export default App;
