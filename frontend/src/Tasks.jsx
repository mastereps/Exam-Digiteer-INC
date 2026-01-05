import { useEffect, useState } from 'react';
import api from "./api/axios"

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        const res = await api.get('/tasks');
        if (!isMounted) return;
        setTasks(res.data);
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load tasks. Check the API and try again.');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
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
          {tasks.map(task => (
            <li key={task.id}>
              {task.title} {task.isDone ? 'ƒo.' : 'ƒ?O'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;
