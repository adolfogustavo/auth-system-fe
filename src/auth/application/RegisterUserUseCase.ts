import { AuthPort } from './ports/AuthPort';
import { Email } from '../domain/value-objects/Email';
import { RegisterUserDTO } from './dtos/RegisterUserDTO';

export class RegisterUserUseCase {
  constructor(private readonly authPort: AuthPort) {}

  async execute(emailValue: string): Promise<RegisterUserDTO> {
    try {
      const email = Email.create(emailValue);
      const registeredUser = await this.authPort.register(email);
      return { success: true, id: registeredUser.id, email: registeredUser.email };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
