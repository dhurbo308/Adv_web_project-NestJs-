import { IsString, IsEmail, MinLength } from 'class-validator';

export class AdminDTO {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
