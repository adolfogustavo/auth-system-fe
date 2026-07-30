type RegisterUserSuccess = {
  success: true;
  id: string;
  email: string;
};

type RegisterUserFailure = {
  success: false;
  error: string;
};

export type RegisterUserDTO = RegisterUserSuccess | RegisterUserFailure;
