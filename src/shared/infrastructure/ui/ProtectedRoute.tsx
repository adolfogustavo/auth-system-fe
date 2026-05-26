import { Navigate } from 'react-router-dom';
import { TokenPort } from '../../application/ports/TokenPort';
import { Routes } from './routes';

interface Props {
  tokenPort: TokenPort;
  children: React.ReactNode;
}

export function ProtectedRoute(props: Props) {
  const hasToken = props.tokenPort.getToken().isSome();
  if (!hasToken) {
    return <Navigate to={Routes.Login} replace />;
  }
  return <>{props.children}</>;
}
