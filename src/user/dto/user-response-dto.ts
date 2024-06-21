/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;

  email: string;
  
  @Exclude()
  password: string;
  
  name: string;
  
  document: string;
  
  birthDate: Date;
}
