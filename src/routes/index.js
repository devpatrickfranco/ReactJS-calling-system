import { Routes, Route } from 'react-router-dom';
import RouterWrapper from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile'
import Customers from '../pages/NewCustomers';
import NewChamado from '../pages/NewChamado';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<RouterWrapper element={SignIn}  />} />
      <Route path='/register' element={<RouterWrapper element={SignUp}  />} />
      <Route path='/dashboard'element={<RouterWrapper element={Dashboard} isPrivate />} />
      <Route path='/profile'element={<RouterWrapper element={Profile} isPrivate />} />
      <Route path='/customers'element={<RouterWrapper element={Customers} isPrivate />} />
      <Route path='/new'element={<RouterWrapper element={NewChamado} isPrivate />} />
      <Route path='/new/:id'element={<RouterWrapper element={NewChamado} isPrivate />} />
    </Routes>
  );
}
