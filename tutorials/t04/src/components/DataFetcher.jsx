import { useState, useEffect } from 'react';

function DataFetcher() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const result = await response.json();
      setUsers(result);
    };

    fetchUsers();
  }, []);

  return (
    <div className="data-container">
      <h2>Database: Registered Players</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default DataFetcher;