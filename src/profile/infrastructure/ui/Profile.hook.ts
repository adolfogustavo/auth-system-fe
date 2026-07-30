import { useState } from 'react';
import { LogoutUseCase } from '../../../auth/application/LogoutUseCase';

interface LogoutState {
  success: boolean;
}

const initialState: LogoutState = {
  success: false,
};

export function useLogout(useCase: LogoutUseCase) {
  const [state, setState] = useState<LogoutState>(initialState);

  const logout = () => {
    useCase.execute();
    setState({ success: true });
  };

  return {
    success: state.success,
    logout,
  };
}
