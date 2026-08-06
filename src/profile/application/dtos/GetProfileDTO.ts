import { ProfileDTO } from './ProfileDTO';

type GetProfileSuccess = {
  success: true;
  profile: ProfileDTO;
};

type GetProfileFailure = {
  success: false;
  error: string;
  sessionInvalid?: boolean;
};

export type GetProfileDTO = GetProfileSuccess | GetProfileFailure;
