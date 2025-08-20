import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logoutUser}>Logout</button>
      <p>Dashboard coming soon...</p>
    </div>
  );
}
