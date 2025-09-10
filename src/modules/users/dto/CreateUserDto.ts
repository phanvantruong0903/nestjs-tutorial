import { IsEmail, IsNotEmpty, MinLength, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Min(1900)
  @Max(new Date().getFullYear())
  YOB: number;
}
