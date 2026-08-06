import { useEffect } from 'react';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useLogin } from './Login.hook';
import { RequestOtpUseCase } from '../../application/RequestOtpUseCase';
import { Routes } from '../../../shared/infrastructure/ui/routes';
import { Factory } from '../../../shared/infrastructure/factory';
import styles from './Login.module.css';

export function LoginContainer() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const useCase = Factory.createRequestOtpUseCase();
  const session = Factory.createValidateSessionUseCase().execute();
  if (session.isValid) {
    return <Navigate to={Routes.Profile} replace />;
  }
  return <Login useCase={useCase} initialEmail={initialEmail} />;
}

interface Props {
  useCase: RequestOtpUseCase;
  initialEmail: string;
}

export function Login(props: Props) {
  const hook = useLogin(props.useCase, props.initialEmail);
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
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
      <Link to={Routes.Register} className={styles.backLink}>
        Create account
      </Link>
    </div>
  );
}
