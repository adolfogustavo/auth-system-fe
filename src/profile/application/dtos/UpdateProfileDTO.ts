import { ProfileDTO } from './ProfileDTO';

type UpdateProfileSuccess = {
  success: true;
  profile: ProfileDTO;
};

type UpdateProfileFailure = {
  success: false;
  error: string;
  sessionInvalid?: boolean;
};

export type UpdateProfileDTO = UpdateProfileSuccess | UpdateProfileFailure;
