import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function Router() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<SignUp />} />
    </Routes>
  );
}

export default Router;
