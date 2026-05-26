import { useState } from 'react';
import { Maybe } from '../../../shared/domain/Maybe';
import { VerifyOtpUseCase } from '../../application/VerifyOtpUseCase';
import { TokenPort } from '../../../shared/application/ports/TokenPort';

interface VerifyState {
  otp: string;
  loading: boolean;
  error: Maybe<string>;
  success: boolean;
}

const initialState: VerifyState = {
  otp: '',
  loading: false,
  error: Maybe.none(),
  success: false,
};

export function useVerify(useCase: VerifyOtpUseCase, tokenPort: TokenPort, email: string) {
  const [state, setState] = useState<VerifyState>(initialState);

  const setOtp = (otp: string) => {
    setState((prev) => ({ ...prev, otp }));
  };

  const startLoading = () => {
    setState((prev) => ({ ...prev, loading: true, error: Maybe.none(), success: false }));
  };

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, error: Maybe.some(error), loading: false }));
  };

  const setSuccess = () => {
    setState((prev) => ({ ...prev, success: true, loading: false }));
  };

  const verifyOtp = async () => {
    startLoading();
    const result = await useCase.execute(email, state.otp);
    if (result.success) {
      tokenPort.saveToken(result.token);
      setSuccess();
    } else {
      setError(result.error);
    }
  };

  return {
    otp: state.otp,
    loading: state.loading,
    error: state.error,
    success: state.success,
    setOtp,
    verifyOtp,
  };
}
