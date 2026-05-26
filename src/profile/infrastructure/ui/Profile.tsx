import { useNavigate } from 'react-router-dom';
import { TokenPort } from '../../../shared/application/ports/TokenPort';
import { Routes } from '../../../shared/infrastructure/ui/routes';
import { Factory } from '../../../shared/infrastructure/factory';
import { ProtectedRoute } from '../../../shared/infrastructure/ui/ProtectedRoute';
import styles from './Profile.module.css';

interface Props {
  tokenPort: TokenPort;
}

export function Profile(props: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    props.tokenPort.clearToken();
    navigate(Routes.Login, { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.subtitle}>Manage your account settings</p>
      </div>
      <div className={styles.placeholder}>
        <p className={styles.placeholderText}>Profile features coming soon...</p>
      </div>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
}

export function ProfileContainer() {
  const tokenPort = Factory.getTokenPort();
  return (
    <ProtectedRoute tokenPort={tokenPort}>
      <Profile tokenPort={tokenPort} />
    </ProtectedRoute>
  );
}
