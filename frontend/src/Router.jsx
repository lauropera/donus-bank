import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserHome from './pages/UserHome';

function Router() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<SignUp />} />
      <Route path='/user' element={<UserHome />} />
    </Routes>
  );
}

export default Router;
