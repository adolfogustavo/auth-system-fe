import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HealthContainer } from '../../../health/infrastructure/ui/Health';
import { LoginContainer } from '../../../auth/infrastructure/ui/Login';
import { VerifyContainer } from '../../../auth/infrastructure/ui/Verify';
import { ProfileContainer } from '../../../profile/infrastructure/ui/Profile';
import { Routes as AppRoutes } from './routes';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.Home} element={<Navigate to={AppRoutes.Login} replace />} />
        <Route path={AppRoutes.Health} element={<HealthContainer />} />
        <Route path={AppRoutes.Login} element={<LoginContainer />} />
        <Route path={AppRoutes.Verify} element={<VerifyContainer />} />
        <Route path={AppRoutes.Profile} element={<ProfileContainer />} />
      </Routes>
    </BrowserRouter>
  );
}
