import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function Router() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
    </Routes>
  );
}

export default Router;
