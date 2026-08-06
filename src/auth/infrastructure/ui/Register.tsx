import { useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useRegister } from './Register.hook';
import { RegisterUserUseCase } from '../../application/RegisterUserUseCase';
import { Routes } from '../../../shared/infrastructure/ui/routes';
import { Factory } from '../../../shared/infrastructure/factory';
import styles from './Register.module.css';

export function RegisterContainer() {
  const useCase = Factory.createRegisterUserUseCase();
  const session = Factory.createValidateSessionUseCase().execute();
  if (session.isValid) {
    return <Navigate to={Routes.Profile} replace />;
  }
  return <Register useCase={useCase} />;
}

interface Props {
  useCase: RegisterUserUseCase;
}

export function Register(props: Props) {
  const hook = useRegister(props.useCase);
  const navigate = useNavigate();

  useEffect(() => {
    if (hook.success) {
      navigate(`${Routes.Login}?email=${encodeURIComponent(hook.email)}`);
    }
  }, [hook.success]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    hook.register();
  };

  const signInPath = hook.email ? `${Routes.Login}?email=${encodeURIComponent(hook.email)}` : Routes.Login;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Enter your email to create a new account</p>
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
          {hook.loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
      <Link to={signInPath} className={styles.backLink}>
        Already have an account? Sign in
      </Link>
    </div>
  );
}
