import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/index';
import AuthenticateProvider from './contexts/authenticate'
import { ToastContainer } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthenticateProvider>
        <BrowserRouter>
          <ToastContainer autoClose={3000}/>
          <AppRoutes />
        </BrowserRouter>
    </AuthenticateProvider>
  );
}

export default App;
  