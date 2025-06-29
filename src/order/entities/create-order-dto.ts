import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  organization: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsString()
  expirationDate: string; // Используем строку вместо Date

  @IsBoolean()
  notify: boolean;
}
