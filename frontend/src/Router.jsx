import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Transactions from './pages/Transactions';
import UserHome from './pages/UserHome';

function Router() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<SignUp />} />
      <Route path='/user' element={<UserHome />} />
      <Route path='/transactions' element={<Transactions />}/>
    </Routes>
  );
}

export default Router;
