import { useEffect } from 'react';
import { useHealth } from './Health.hook';
import { HealthUseCase } from '../../application/HealthUseCase';
import { HealthDTO } from '../../application/HealthDTO';
import { Factory } from '../../../shared/infrastructure/factory';
import styles from './Health.module.css';

export function HealthContainer() {
  const useCase = Factory.createHealthUseCase();
  return <Health useCase={useCase} />;
}

export function Health(props: { useCase: HealthUseCase }) {
  const hook = useHealth(props.useCase);

  useEffect(() => {
    hook.loadHealthStatus();
  }, []);

  if (hook.error.isSome()) {
    return (
      <ErrorMessage message={hook.error.getOrThrow().message} onRetry={hook.loadHealthStatus} loading={hook.loading} />
    );
  }
  if (hook.loading) {
    return <Loading />;
  }
  return hook.health.fold(
    () => <Empty />,
    (health) => <Details health={health} onRefresh={hook.loadHealthStatus} loading={hook.loading} />
  );
}

function ErrorMessage(props: { message: string; onRetry: () => void; loading: boolean }) {
  return (
    <div className={styles.container}>
      <div className={styles.error}>
        <span className={styles.errorTitle}>Error</span>
        <span className={styles.errorMessage}>{props.message}</span>
      </div>
      <button className={styles.refreshButton} onClick={props.onRetry} disabled={props.loading}>
        Retry
      </button>
    </div>
  );
}

function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.loading}>Checking health status...</div>
    </div>
  );
}

function Empty() {
  return (
    <div className={styles.container}>
      <div className={styles.empty}>No health data available</div>
    </div>
  );
}

function Details(props: { health: HealthDTO; onRefresh: () => void; loading: boolean }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Health</h1>
        <p className={styles.subtitle}>Current status of the application</p>
      </div>
      <div className={styles.statusCard}>
        <StatusRow label="Status" value={<span className={styles.healthy}>● {props.health.status}</span>} />
        <StatusRow label="Uptime" value={props.health.formattedUptime} />
        <StatusRow label="Started" value={props.health.formattedCreatedAt} />
        <StatusRow label="Last Check" value={props.health.formattedLastCheckedAt} />
      </div>
      <button className={styles.refreshButton} onClick={props.onRefresh} disabled={props.loading}>
        Refresh Status
      </button>
    </div>
  );
}

function StatusRow(props: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.statusRow}>
      <span className={styles.label}>{props.label}</span>
      <span className={styles.value}>{props.value}</span>
    </div>
  );
}
