import { Navigate } from 'react-router-dom';
import { Routes } from './routes';

interface Props {
  isSessionValid: boolean;
  children: React.ReactNode;
}

export function ProtectedRoute(props: Props) {
  if (!props.isSessionValid) {
    return <Navigate to={Routes.Login} replace />;
  }
  return <>{props.children}</>;
}
