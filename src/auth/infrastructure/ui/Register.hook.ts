import { useState } from 'react';
import { Maybe } from '../../../shared/domain/Maybe';
import { RegisterUserUseCase } from '../../application/RegisterUserUseCase';

interface RegisterState {
  email: string;
  loading: boolean;
  error: Maybe<string>;
  success: boolean;
}

const initialState: RegisterState = {
  email: '',
  loading: false,
  error: Maybe.none(),
  success: false,
};

export function useRegister(useCase: RegisterUserUseCase) {
  const [state, setState] = useState<RegisterState>(initialState);

  const setEmail = (email: string) => {
    setState((prev) => ({ ...prev, email, error: Maybe.none() }));
  };

  const startLoading = () => {
    setState((prev) => ({ ...prev, loading: true, error: Maybe.none(), success: false }));
  };

  const setSuccess = () => {
    setState((prev) => ({ ...prev, success: true, loading: false }));
  };

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, error: Maybe.some(error), loading: false }));
  };

  const register = async () => {
    startLoading();
    const result = await useCase.execute(state.email);
    if (result.success) {
      setSuccess();
    } else {
      setError(result.error);
    }
  };

  return {
    email: state.email,
    loading: state.loading,
    error: state.error,
    success: state.success,
    setEmail,
    register,
  };
}
