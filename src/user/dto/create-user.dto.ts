import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Role } from 'src/enums/roles.enum';
import { tag_entity } from 'src/tag/entities/tag.entity';

export class createUser {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Please enter a valid firstname' })
  firstname: string;
  @ApiProperty()
  @IsString({ message: 'Please enter a valid lastname' })
  @IsNotEmpty()
  lastname: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'Please enter a valid email' })
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Please enter a valid username' })
  username: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Please enter a valid password' })
  password: string;
  @ApiProperty()
  @IsString()
  image: string;
}
