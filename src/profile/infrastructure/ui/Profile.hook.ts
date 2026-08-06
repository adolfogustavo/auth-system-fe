import { useState } from 'react';
import { Maybe } from '../../../shared/domain/Maybe';
import { LogoutUseCase } from '../../../auth/application/LogoutUseCase';
import { GetProfileUseCase } from '../../application/GetProfileUseCase';
import { UpdateProfileUseCase } from '../../application/UpdateProfileUseCase';
import { ProfileDTO } from '../../application/dtos/ProfileDTO';

interface LogoutState {
  success: boolean;
}

const initialLogoutState: LogoutState = {
  success: false,
};

export function useLogout(useCase: LogoutUseCase) {
  const [state, setState] = useState<LogoutState>(initialLogoutState);

  const logout = () => {
    useCase.execute();
    setState({ success: true });
  };

  return {
    success: state.success,
    logout,
  };
}

interface ProfileState {
  profile: Maybe<ProfileDTO>;
  name: string;
  lastName: string;
  phone: string;
  loading: boolean;
  saving: boolean;
  error: Maybe<string>;
  success: boolean;
  sessionInvalid: boolean;
}

const initialProfileState: ProfileState = {
  profile: Maybe.none(),
  name: '',
  lastName: '',
  phone: '',
  loading: false,
  saving: false,
  error: Maybe.none(),
  success: false,
  sessionInvalid: false,
};

export function useProfile(getUseCase: GetProfileUseCase, updateUseCase: UpdateProfileUseCase) {
  const [state, setState] = useState<ProfileState>(initialProfileState);

  const setName = (name: string) => {
    setState((prev) => ({ ...prev, name, error: Maybe.none(), success: false }));
  };

  const setLastName = (lastName: string) => {
    setState((prev) => ({ ...prev, lastName, error: Maybe.none(), success: false }));
  };

  const setPhone = (phone: string) => {
    setState((prev) => ({ ...prev, phone, error: Maybe.none(), success: false }));
  };

  const startLoading = () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: Maybe.none(),
      success: false,
    }));
  };

  const startSaving = () => {
    setState((prev) => ({
      ...prev,
      saving: true,
      error: Maybe.none(),
      success: false,
    }));
  };

  const applyProfile = (profile: ProfileDTO) => {
    setState((prev) => ({
      ...prev,
      profile: Maybe.some(profile),
      name: profile.name,
      lastName: profile.lastName,
      phone: profile.phone,
      loading: false,
      saving: false,
    }));
  };

  const setError = (error: string) => {
    setState((prev) => ({
      ...prev,
      error: Maybe.some(error),
      loading: false,
      saving: false,
      success: false,
      sessionInvalid: false,
    }));
  };

  const setSessionInvalid = (error: string) => {
    setState((prev) => ({
      ...prev,
      error: Maybe.some(error),
      loading: false,
      saving: false,
      success: false,
      sessionInvalid: true,
    }));
  };

  const setSuccess = (profile: ProfileDTO) => {
    setState((prev) => ({
      ...prev,
      profile: Maybe.some(profile),
      name: profile.name,
      lastName: profile.lastName,
      phone: profile.phone,
      saving: false,
      success: true,
      error: Maybe.none(),
    }));
  };

  const loadProfile = async () => {
    startLoading();
    const result = await getUseCase.execute();
    if (result.success) {
      applyProfile(result.profile);
    } else if (result.sessionInvalid === true) {
      setSessionInvalid(result.error);
    } else {
      setError(result.error);
    }
  };

  const saveProfile = async () => {
    startSaving();
    const result = await updateUseCase.execute(state.name, state.lastName, state.phone);
    if (result.success) {
      setSuccess(result.profile);
    } else if (result.sessionInvalid === true) {
      setSessionInvalid(result.error);
    } else {
      setError(result.error);
    }
  };

  return {
    profile: state.profile,
    name: state.name,
    lastName: state.lastName,
    phone: state.phone,
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    success: state.success,
    sessionInvalid: state.sessionInvalid,
    setName,
    setLastName,
    setPhone,
    loadProfile,
    saveProfile,
  };
}
