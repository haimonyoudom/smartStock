import { IsEmail, IsString, Length } from 'class-validator';

export class CreateCashierDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 100)
  password: string;
}
