/* eslint-disable prettier/prettier */
import { IsDateString, IsEmail, IsNotEmpty, MaxDate, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserRoles } from '../enum/user-roles.enum';
import { IsCPF } from 'brazilian-class-validator';

@ValidatorConstraint({ name: 'isEarlierDate', async: false })
class IsEarlierDate implements ValidatorConstraintInterface {
  validate(birthDate: string, args: ValidationArguments) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(birthDate);

    return date < today;
  }

  defaultMessage(args: ValidationArguments) {
    return 'birthDate must be less than the current date';
  }
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsCPF()
  document: string;

  @IsNotEmpty()
  @IsDateString()
  @Validate(IsEarlierDate)
  birthDate: string;

  role: UserRoles;
}
