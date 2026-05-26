import { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useLogin } from './Login.hook';
import { RequestOtpUseCase } from '../../application/RequestOtpUseCase';
import { Routes } from '../../../shared/infrastructure/ui/routes';
import { Factory } from '../../../shared/infrastructure/factory';
import styles from './Login.module.css';

export function LoginContainer() {
  const useCase = Factory.createRequestOtpUseCase();
  const tokenPort = Factory.getTokenPort();
  if (tokenPort.getToken().isSome()) {
    return <Navigate to={Routes.Profile} replace />;
  }
  return <Login useCase={useCase} />;
}

interface Props {
  useCase: RequestOtpUseCase;
}

export function Login(props: Props) {
  const hook = useLogin(props.useCase);
  const navigate = useNavigate();

  useEffect(() => {
    if (hook.success) {
      navigate(`${Routes.Verify}?email=${encodeURIComponent(hook.email)}`);
    }
  }, [hook.success]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    hook.requestOtp();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>Enter your email to receive a verification code</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="you@example.com"
            value={hook.email}
            onChange={(e) => hook.setEmail(e.target.value)}
            disabled={hook.loading}
          />
        </div>
        {hook.error.isSome() && (
          <div className={styles.error}>
            <span className={styles.errorMessage}>{hook.error.getOrThrow()}</span>
          </div>
        )}
        <button type="submit" className={styles.submitButton} disabled={hook.loading}>
          {hook.loading ? 'Sending...' : 'Send Code'}
        </button>
      </form>
    </div>
  );
}
