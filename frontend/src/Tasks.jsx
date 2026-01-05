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
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState("");

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

  async function handleToggle(task) {
    setActionError("");
    setSavingId(task.id);
    try {
      const res = await api.put(`/tasks/${task.id}`, {
        title: task.title,
        isDone: !task.isDone,
        userId: task.userId,
      });
      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? res.data : item))
      );
    } catch (error) {
      setActionError("Failed to update task. Check the API and try again.");
      console.error(error);
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(taskId) {
    setActionError("");
    setDeletingId(taskId);
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      setActionError("Failed to delete task. Check the API and try again.");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Task board</p>
          <h2 className="panel-title">Tasks</h2>
          <p className="panel-subtitle">
            Add tasks, assign ownership, and track completion status.
          </p>
        </div>
      </div>

      <form className="task-form" onSubmit={handleCreate}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              className="input"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="task-user">
              User ID
            </label>
            <input
              id="task-user"
              className="input"
              type="number"
              min="1"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder="1"
            />
            <p className="field-help">Requires an existing user record.</p>
          </div>
          <div className="form-field form-checkbox">
            <label className="form-label" htmlFor="task-done">
              Done
            </label>
            <input
              id="task-done"
              className="checkbox"
              type="checkbox"
              checked={newIsDone}
              onChange={(e) => setNewIsDone(e.target.checked)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="button button-primary" type="submit" disabled={isCreating}>
            {isCreating ? "Saving..." : "Add task"}
          </button>
          <div className="form-status">
            {createError && <p className="status status-error">{createError}</p>}
            {createSuccess && (
              <p className="status status-success">{createSuccess}</p>
            )}
          </div>
        </div>
      </form>

      <div className="divider" />

      {isLoading && <p className="status">Loading tasks...</p>}
      {error && <p className="status status-error">{error}</p>}
      {actionError && <p className="status status-error">{actionError}</p>}
      {!isLoading && !error && tasks.length === 0 && (
        <p className="status status-muted">No tasks yet. Add one above.</p>
      )}
      {!isLoading && !error && tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li className="task-item" key={task.id} style={{ "--i": index }}>
              <div className="task-main">
                <div>
                  <p className="task-title">{task.title}</p>
                  <p className="task-meta">User {task.userId}</p>
                </div>
                <span
                  className={`task-status ${
                    task.isDone ? "is-done" : "is-pending"
                  }`}
                >
                  {task.isDone ? "Done" : "Pending"}
                </span>
              </div>
              <div className="task-actions">
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={() => handleToggle(task)}
                  disabled={savingId === task.id || deletingId === task.id}
                >
                  {savingId === task.id
                    ? "Updating..."
                    : task.isDone
                    ? "Mark pending"
                    : "Mark done"}
                </button>
                <button
                  className="button button-danger"
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  disabled={deletingId === task.id || savingId === task.id}
                >
                  {deletingId === task.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Tasks;
