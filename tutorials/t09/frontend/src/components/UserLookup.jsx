import { useState } from 'react';

function UserLookup() {
  const [searchId, setSearchId] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setUser(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${searchId}`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      setUser(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Search for user</h2>
      <input
        type="text"
        placeholder="Enter user ID (1-5)"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading || !searchId}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <div className="error-banner" style={{ marginTop: '15px' }}>Error: {error}</div>}

      {user && (
        <div className="result-box">
          <strong>{user.name}</strong> - {user.role}
        </div>
      )}
    </div>
  );
}

export default UserLookup;
