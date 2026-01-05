import { useEffect, useState } from "react";
import api from "./api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [newIsDone, setNewIsDone] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

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

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    const title = newTitle.trim();
    const userId = Number(newUserId);

    if (!title) {
      setCreateError("Title is required.");
      return;
    }
    if (!Number.isInteger(userId) || userId <= 0) {
      setCreateError("User ID must be a positive number.");
      return;
    }

    setIsCreating(true);
    try {
      const res = await api.post("/tasks", {
        title,
        isDone: newIsDone,
        userId,
      });
      setTasks((prev) => [res.data, ...prev]);
      setNewTitle("");
      setNewUserId("");
      setNewIsDone(false);
      setCreateSuccess("Task created.");
    } catch (error) {
      setCreateError("Failed to create task. Check the API and try again.");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div>
      <h2>Tasks</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>
            Title
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </label>
        </div>
        <div>
          <label>
            User ID
            <input
              type="number"
              min="1"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder="1"
            />
          </label>
        </div>
        <div>
          <label>
            Done
            <input
              type="checkbox"
              checked={newIsDone}
              onChange={(e) => setNewIsDone(e.target.checked)}
            />
          </label>
        </div>
        <button type="submit" disabled={isCreating}>
          {isCreating ? "Saving..." : "Add Task"}
        </button>
        {createError && <p>{createError}</p>}
        {createSuccess && <p>{createSuccess}</p>}
      </form>
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
