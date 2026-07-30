import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from './Profile.hook';
import { LogoutUseCase } from '../../../auth/application/LogoutUseCase';
import { Routes } from '../../../shared/infrastructure/ui/routes';
import { Factory } from '../../../shared/infrastructure/factory';
import { ProtectedRoute } from '../../../shared/infrastructure/ui/ProtectedRoute';
import styles from './Profile.module.css';

interface Props {
  useCase: LogoutUseCase;
}

export function Profile(props: Props) {
  const hook = useLogout(props.useCase);
  const navigate = useNavigate();

  useEffect(() => {
    if (hook.success) {
      navigate(Routes.Login, { replace: true });
    }
  }, [hook.success]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.subtitle}>Manage your account settings</p>
      </div>
      <div className={styles.placeholder}>
        <p className={styles.placeholderText}>Profile features coming soon...</p>
      </div>
      <button className={styles.logoutButton} onClick={hook.logout}>
        Sign Out
      </button>
    </div>
  );
}

export function ProfileContainer() {
  const tokenPort = Factory.getTokenPort();
  const useCase = Factory.createLogoutUseCase();
  return (
    <ProtectedRoute tokenPort={tokenPort}>
      <Profile useCase={useCase} />
    </ProtectedRoute>
  );
}
