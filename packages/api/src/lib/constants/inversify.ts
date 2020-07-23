export const REPOSITORY = {
  UserRepository: Symbol("UserRepository"),
  EmailConfirmationRepository: Symbol("EmailConfirmationRepository"),
  ForgotPasswordRepository: Symbol("ForgotPasswordRepository"),
  ClientRepository: Symbol("ClientRepository"),
};

export const SERVICE = {
  Mailer: Symbol("Mailer"),
  ForgotPasswordEmail: Symbol("ForgotPasswordEmail"),
  RegisterEmail: Symbol("RegisterEmail"),
  AuthService: Symbol("AuthService"),
  OAuthServerService: Symbol("OAuthServerService"),
};
