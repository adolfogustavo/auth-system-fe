import { useState } from 'react';
import { Maybe } from '../../../shared/domain/Maybe';
import { RequestOtpUseCase } from '../../application/RequestOtpUseCase';

interface LoginState {
  email: string;
  loading: boolean;
  error: Maybe<string>;
  success: boolean;
}

const initialState: LoginState = {
  email: '',
  loading: false,
  error: Maybe.none(),
  success: false,
};

export function useLogin(useCase: RequestOtpUseCase) {
  const [state, setState] = useState<LoginState>(initialState);

  const setEmail = (email: string) => {
    setState((prev) => ({ ...prev, email }));
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

  const requestOtp = async () => {
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
    requestOtp,
  };
}
