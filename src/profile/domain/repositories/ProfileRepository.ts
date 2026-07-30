import { Profile, ProfileUpdateParams } from '../entities/Profile';
import { Maybe } from '../../../shared/domain/Maybe';
import { DomainError } from '../../../shared/domain/DomainError';

export interface ProfileRepository {
  findCurrent(): Promise<Maybe<Profile>>;
  update(data: ProfileUpdateParams): Promise<Profile>;
}

export class InMemoryProfileRepository implements ProfileRepository {
  constructor(private profile: Maybe<Profile> = Maybe.none()) {}

  async findCurrent(): Promise<Maybe<Profile>> {
    return this.profile;
  }

  async update(data: ProfileUpdateParams): Promise<Profile> {
    return this.profile.fold(
      () => {
        throw DomainError.createNotFound('Profile not found');
      },
      (profile) => {
        profile.update(data);
        this.profile = Maybe.some(profile);
        return profile;
      }
    );
  }

  static withProfile(profile: Profile): InMemoryProfileRepository {
    return new InMemoryProfileRepository(Maybe.some(profile));
  }

  static empty(): InMemoryProfileRepository {
    return new InMemoryProfileRepository(Maybe.none());
  }
}
