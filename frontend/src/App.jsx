import "./App.css";
import Tasks from "./Tasks";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-mark" aria-hidden="true">
          TE
        </div>
        <div>
          <p className="app-eyebrow">Task evaluator</p>
          <h1 className="app-title">React Task Evaluator</h1>
          <p className="app-subtitle">
            Practical task tracking with ownership and status updates.
          </p>
        </div>
      </header>
      <Tasks />
    </div>
  );
}

export default App;
