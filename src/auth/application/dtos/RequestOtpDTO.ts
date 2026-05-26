type RequestOtpSuccess = {
  success: true;
};

type RequestOtpFailure = {
  success: false;
  error: string;
};

export type RequestOtpDTO = RequestOtpSuccess | RequestOtpFailure;
