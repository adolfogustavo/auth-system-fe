import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout, useProfile } from './Profile.hook';
import { LogoutUseCase } from '../../../auth/application/LogoutUseCase';
import { GetProfileUseCase } from '../../application/GetProfileUseCase';
import { UpdateProfileUseCase } from '../../application/UpdateProfileUseCase';
import { Routes } from '../../../shared/infrastructure/ui/routes';
import { Factory } from '../../../shared/infrastructure/factory';
import { ProtectedRoute } from '../../../shared/infrastructure/ui/ProtectedRoute';
import styles from './Profile.module.css';

interface Props {
  getProfileUseCase: GetProfileUseCase;
  updateProfileUseCase: UpdateProfileUseCase;
  logoutUseCase: LogoutUseCase;
}

function isPhoneFormatError(message: string): boolean {
  return message === 'Invalid phone format';
}

export function Profile(props: Props) {
  const hook = useProfile(props.getProfileUseCase, props.updateProfileUseCase);
  const logoutHook = useLogout(props.logoutUseCase);
  const navigate = useNavigate();
  useEffect(() => {
    hook.loadProfile();
  }, []);
  useEffect(() => {
    if (logoutHook.success || hook.sessionInvalid) {
      navigate(Routes.Login, { replace: true });
    }
  }, [logoutHook.success, hook.sessionInvalid]);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    hook.saveProfile();
  };
  if (hook.loading && hook.profile.isNone()) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>Manage your account settings</p>
        </div>
        <p className={styles.loading}>Loading profile...</p>
      </div>
    );
  }
  const profileIsIncomplete = hook.name === '' && hook.lastName === '' && hook.phone === '';
  const phoneError = hook.error.fold(
    () => '',
    (message) => (isPhoneFormatError(message) ? message : '')
  );
  const generalError = hook.error.fold(
    () => '',
    (message) => (isPhoneFormatError(message) ? '' : message)
  );
  const hasPhoneError = phoneError !== '';
  const hasGeneralError = generalError !== '';
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.subtitle}>Manage your account settings</p>
      </div>
      {hook.profile.isSome() && profileIsIncomplete && (
        <div className={styles.guidance}>
          <span className={styles.guidanceMessage}>Complete your profile to personalize your account</span>
        </div>
      )}
      {hasGeneralError && (
        <div className={styles.error}>
          <span className={styles.errorMessage}>{generalError}</span>
        </div>
      )}
      {hook.success && (
        <div className={styles.success}>
          <span className={styles.successMessage}>Profile updated successfully</span>
        </div>
      )}
      {hook.profile.isSome() && (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${styles.emailInput}`}
              value={hook.profile.getOrThrow().email}
              title={hook.profile.getOrThrow().email}
              disabled
              readOnly
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              value={hook.name}
              onChange={(e) => hook.setName(e.target.value)}
              disabled={hook.saving}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className={styles.input}
              value={hook.lastName}
              onChange={(e) => hook.setLastName(e.target.value)}
              disabled={hook.saving}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              className={hasPhoneError ? `${styles.input} ${styles.inputInvalid}` : styles.input}
              placeholder="612345678"
              value={hook.phone}
              onChange={(e) => hook.setPhone(e.target.value)}
              disabled={hook.saving}
              aria-invalid={hasPhoneError}
              aria-describedby={hasPhoneError ? 'phone-error phone-hint' : 'phone-hint'}
            />
            <span id="phone-hint" className={styles.fieldHint}>
              7–15 digits, numbers only
            </span>
            {hasPhoneError && (
              <span id="phone-error" className={styles.fieldError} role="alert">
                {phoneError}
              </span>
            )}
          </div>
          <button type="submit" className={styles.submitButton} disabled={hook.saving}>
            {hook.saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
      <div className={styles.sessionSection}>
        <button className={styles.logoutButton} onClick={logoutHook.logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function ProfileContainer() {
  const session = Factory.createValidateSessionUseCase().execute();
  const getProfileUseCase = Factory.createGetProfileUseCase();
  const updateProfileUseCase = Factory.createUpdateProfileUseCase();
  const logoutUseCase = Factory.createLogoutUseCase();
  return (
    <ProtectedRoute isSessionValid={session.isValid}>
      <Profile
        getProfileUseCase={getProfileUseCase}
        updateProfileUseCase={updateProfileUseCase}
        logoutUseCase={logoutUseCase}
      />
    </ProtectedRoute>
  );
}
