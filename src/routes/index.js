import { Routes, Route } from 'react-router-dom';
import RouterWrapper from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile'
import Customers from '../pages/NewCustomers';
import NewChamado from '../pages/NewChamado';
import Resolved from '../pages/Resolved'; 
import Users from '../pages/Users'
import Category from '../pages/Category'
import TesteCategory from '../pages/Category/category'
import CalendarPage from '../pages/Calendar';

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
      <Route path='/resolved'element={<RouterWrapper element={Resolved} isPrivate />} />
      <Route path='/category'element={<RouterWrapper element={Category} isPrivate />} />
      <Route path='/users'element={<RouterWrapper element={Users} isPrivate />} />
      <Route path='/teste'element={<RouterWrapper element={TesteCategory} isPrivate />} />
      <Route path='/calendar'element={<RouterWrapper element={CalendarPage}  isPrivate/>} />

    </Routes>
  );
}
