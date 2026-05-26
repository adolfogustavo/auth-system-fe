type VerifyOtpSuccess = {
  success: true;
  token: string;
};

type VerifyOtpFailure = {
  success: false;
  error: string;
};

export type VerifyOtpDTO = VerifyOtpSuccess | VerifyOtpFailure;
