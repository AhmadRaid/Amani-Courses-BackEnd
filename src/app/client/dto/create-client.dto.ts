import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateClientDto {
  
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
    
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' }) // شرط لتعقيد كلمة المرور
  password: string;
}