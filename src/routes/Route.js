import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthenticateContext } from '../contexts/authenticate'

export default function RouterWrapper({
  element: Element,
  isPrivate,
  ...rest
}) {

  const { signed, loading } = useContext(AuthenticateContext)

  if (loading) {
    return <div>Loading...</div>; // Pode adicionar um loader aqui
  }

  if (!signed && isPrivate) {
    return <Navigate to='/' />;
  }

  if (signed && !isPrivate) {
    return <Navigate to='/dashboard' />;
  }

  return <Element {...rest} />;
}