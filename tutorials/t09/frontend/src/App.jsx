import UserDashboard from './components/UserDashboard';
import UserLookup from './components/UserLookup';

export default function App() {
  return (
    <div className="app-container">
      <h1 style={{ color: '#0be881', borderBottom: '2px solid #485460', paddingBottom: '10px' }}>
        Tutorial 09: The Bridge (MVC)
      </h1>
      <UserDashboard />
      <UserLookup />
    </div>
  );
}