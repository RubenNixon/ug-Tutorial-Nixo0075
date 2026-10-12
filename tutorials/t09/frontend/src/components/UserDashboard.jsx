import { useState, useEffect } from 'react';

function UserDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="card"><p>Establishing bridge... Loading data.</p></div>;
  if (error) return <div className="card"><div className="error-banner">Error: {error}</div></div>;

  return (
    <div className="card">
      <h2>User Directory</h2>
      <ul>
        {data.map(user => (
          <li key={user.userId}>
            <strong>{user.name}</strong> - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserDashboard;
