import { useEffect, useState } from "react";
import api from "./api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        const res = await api.get("/tasks");
        if (!isMounted) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.items;
        if (!Array.isArray(data)) {
          setError("Unexpected response from API. Expected a task list.");
          setTasks([]);
          return;
        }
        setTasks(data);
      } catch (error) {
        if (!isMounted) return;
        setError("Failed to load tasks. Check the API and try again.");
        console.error(error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h2>Tasks</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title} {task.isDone ? "✅" : "❌"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;
