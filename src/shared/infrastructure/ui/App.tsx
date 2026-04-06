import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HealthContainer } from '../../../health/infrastructure/ui/Health';
import { Routes as AppRoutes } from './routes';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.Home} element={<Navigate to={AppRoutes.Health} replace />} />
        <Route path={AppRoutes.Health} element={<HealthContainer />} />
      </Routes>
    </BrowserRouter>
  );
}
