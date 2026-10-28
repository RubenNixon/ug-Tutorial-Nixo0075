import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Navbar() {
  const { user, login } = useContext(UserContext);

  return (
    <div className="navbar">
      <h2>Flinders Tech Store</h2>
      <div>
        {user ? (
          <span>Welcome, {user.name}</span>
        ) : (
          <button className="btn-primary" onClick={login}>Login</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
