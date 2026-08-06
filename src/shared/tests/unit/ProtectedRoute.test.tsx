import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../../infrastructure/ui/ProtectedRoute';

function renderProtected(isSessionValid: boolean) {
  return render(
    <MemoryRouter initialEntries={['/profile']}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isSessionValid={isSessionValid}>
              <div>Protected content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('The ProtectedRoute', () => {
  it('redirects to login when the session is invalid', () => {
    renderProtected(false);

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children when the session is valid', () => {
    renderProtected(true);

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
