import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Health } from '../../../../infrastructure/ui/Health';
import { HealthUseCase } from '../../../../application/HealthUseCase';
import { InMemoryHealthRepository } from '../../../../domain/repositories/HealthRepository';
import { Health as HealthEntity } from '../../../../domain/entities/Health';
import { Id } from '../../../../../shared/domain/value-objects/Id';

describe('The Health Status Display', () => {
  const jan1At10am = new Date('2026-01-01T10:00:00.000Z');

  it('indicates loading while checking system status', async () => {
    const health = HealthEntity.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    render(<Health useCase={useCase} />);

    expect(screen.getByText('Checking health status...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Checking health status...')).not.toBeInTheDocument();
    });
  });

  it('shows healthy status when system is operational', async () => {
    const health = HealthEntity.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    render(<Health useCase={useCase} />);

    await waitFor(() => {
      expect(screen.getByText('● healthy')).toBeInTheDocument();
    });
  });

  it('presents the system health title', async () => {
    const health = HealthEntity.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    render(<Health useCase={useCase} />);

    await waitFor(() => {
      expect(screen.getByText('System Health')).toBeInTheDocument();
    });
  });

  it('shows uptime information', async () => {
    const health = HealthEntity.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    render(<Health useCase={useCase} />);

    await waitFor(() => {
      expect(screen.getByText('Uptime')).toBeInTheDocument();
      expect(screen.getByText('0s')).toBeInTheDocument();
    });
  });

  it('shows error details when health check fails', async () => {
    const failingRepository = {
      async find() {
        throw new Error('Connection refused');
      },
    };
    const useCase = new HealthUseCase(failingRepository);

    render(<Health useCase={useCase} />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Connection refused')).toBeInTheDocument();
    });
  });

  it('offers a retry option when an error occurs', async () => {
    const failingRepository = {
      async find() {
        throw new Error('Network error');
      },
    };
    const useCase = new HealthUseCase(failingRepository);

    render(<Health useCase={useCase} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  it('offers a refresh option when status is displayed', async () => {
    const health = HealthEntity.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    render(<Health useCase={useCase} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Refresh Status' })).toBeInTheDocument();
    });
  });

  it('refreshes the status when user clicks refresh', async () => {
    const user = userEvent.setup();
    const health = HealthEntity.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    render(<Health useCase={useCase} />);

    await waitFor(() => {
      expect(screen.getByText('● healthy')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: 'Refresh Status' });
    await user.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('● healthy')).toBeInTheDocument();
    });
  });
});
