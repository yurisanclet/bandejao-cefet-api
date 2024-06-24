/* eslint-disable prettier/prettier */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

enum NumericFields {
  accompaniment = 'Acompanhamento',
  garnish = 'Guarnição',
  mainCourse = 'Prato principal',
  dessert = 'Sobremesa',
}

@Injectable()
export class ValidateStringNotNumericPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const numericFields = ['accompaniment', 'garnish', 'mainCourse', 'dessert'];
    numericFields.forEach((field) => {
      if (value.hasOwnProperty(field)) {
        const regex = /^[A-Za-zç\s]+$/;
        if (!regex.test(value[field])) {
          throw new BadRequestException(
            `${NumericFields[field]} deve conter apenas letras`,
          );
        }
      }
    });

    return value;
  }
}
