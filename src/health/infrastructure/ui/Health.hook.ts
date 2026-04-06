import { useState } from 'react';
import { Maybe } from '../../../shared/domain/Maybe';
import { HealthDTO } from '../../application/HealthDTO';
import { HealthUseCase } from '../../application/HealthUseCase';

interface HealthState {
  health: Maybe<HealthDTO>;
  loading: boolean;
  error: Maybe<Error>;
}

const initialState: HealthState = {
  health: Maybe.none(),
  loading: false,
  error: Maybe.none(),
};

export function useHealth(useCase: HealthUseCase) {
  const [state, setState] = useState<HealthState>(initialState);

  const startLoading = () => {
    setState((prev) => ({ ...prev, loading: true, error: Maybe.none() }));
  };

  const setHealth = (health: HealthDTO) => {
    setState((prev) => ({ ...prev, health: Maybe.some(health), loading: false }));
  };

  const setError = (error: Error) => {
    setState((prev) => ({ ...prev, error: Maybe.some(error), loading: false }));
  };

  const loadHealthStatus = async () => {
    startLoading();
    try {
      const health = await useCase.execute();
      setHealth(health);
    } catch (error) {
      setError(error as Error);
    }
  };

  return {
    health: state.health,
    loading: state.loading,
    error: state.error,
    loadHealthStatus,
  };
}
