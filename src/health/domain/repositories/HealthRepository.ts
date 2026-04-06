import { Health } from '../entities/Health';
import { Maybe } from '../../../shared/domain/Maybe';

export interface HealthRepository {
  find(): Promise<Maybe<Health>>;
}

export class InMemoryHealthRepository implements HealthRepository {
  constructor(private readonly health: Maybe<Health> = Maybe.none()) {}

  async find(): Promise<Maybe<Health>> {
    return this.health;
  }

  static withHealth(health: Health): InMemoryHealthRepository {
    return new InMemoryHealthRepository(Maybe.some(health));
  }

  static empty(): InMemoryHealthRepository {
    return new InMemoryHealthRepository(Maybe.none());
  }
}
