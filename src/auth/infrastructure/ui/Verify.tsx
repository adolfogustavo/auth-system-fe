import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link, Navigate } from 'react-router-dom';
import { useVerify } from './Verify.hook';
import { VerifyOtpUseCase } from '../../application/VerifyOtpUseCase';
import { TokenPort } from '../../../shared/application/ports/TokenPort';
import { Routes } from '../../../shared/infrastructure/ui/routes';
import { Factory } from '../../../shared/infrastructure/factory';
import styles from './Verify.module.css';

export function VerifyContainer() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const tokenPort = Factory.getTokenPort();
  const session = Factory.createValidateSessionUseCase().execute();
  if (session.isValid) {
    return <Navigate to={Routes.Profile} replace />;
  }
  if (!email) {
    return <Navigate to={Routes.Login} replace />;
  }
  const useCase = Factory.createVerifyOtpUseCase();
  return <Verify useCase={useCase} tokenPort={tokenPort} email={email} />;
}

interface Props {
  useCase: VerifyOtpUseCase;
  tokenPort: TokenPort;
  email: string;
}

export function Verify(props: Props) {
  const hook = useVerify(props.useCase, props.tokenPort, props.email);
  const navigate = useNavigate();

  useEffect(() => {
    if (hook.success) {
      navigate(Routes.Profile, { replace: true });
    }
  }, [hook.success]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    hook.verifyOtp();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Enter Code</h1>
        <p className={styles.subtitle}>
          We sent a verification code to <span className={styles.email}>{props.email}</span>
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="otp">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            className={styles.input}
            placeholder="000000"
            value={hook.otp}
            onChange={(e) => hook.setOtp(e.target.value)}
            disabled={hook.loading}
            autoComplete="one-time-code"
          />
        </div>
        {hook.error.isSome() && (
          <div className={styles.error}>
            <span className={styles.errorMessage}>{hook.error.getOrThrow()}</span>
          </div>
        )}
        <button type="submit" className={styles.submitButton} disabled={hook.loading}>
          {hook.loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
      <Link to={Routes.Login} className={styles.backLink}>
        Back to login
      </Link>
    </div>
  );
}
