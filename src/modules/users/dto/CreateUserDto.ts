import { IsEmail, IsNotEmpty, MinLength, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @MinLength(6)
  password: string;

  @Min(1900)
  @Max(new Date().getFullYear())
  YOB: number;
}
