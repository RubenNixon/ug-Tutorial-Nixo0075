import { useState, useEffect } from 'react'
import './styles.css'
import AuthForm from './components/AuthForm'
import ItemForm from './components/ItemForm'
import ItemCard from './components/ItemCard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    fetchItems();
  }, [token]);

  const handleLogin = (jwt) => {
    setToken(jwt);
    localStorage.setItem('token', jwt);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setItems([]);
  };

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setItems(items.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = (updatedItem) => {
    setItems(items.map(item => item._id === updatedItem._id ? updatedItem : item));
  };

  return (
    <div className="app-container">
      <h1 className="header">Session 10: Secure Data Mutability</h1>
      {!token ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <div>
          <button className="cancel-btn" onClick={handleLogout}>Logout</button>
          <ItemForm onAdd={handleAddItem} token={token} />
          <div>
            {items.length === 0 && <p className="empty-text">No records found.</p>}
            {items.map(item => (
              <ItemCard
                key={item._id}
                item={item}
                token={token}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App
