import { ApiProperty } from '@nestjs/swagger';
import {
    IsDefined,
    IsEmail,
    IsMongoId,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateMailTemplateDto {
    @ApiProperty()
    @IsDefined()
    @IsString()
    application: string;

    @ApiProperty()
    @IsDefined()
    @MaxLength(2)
    @IsString()
    language: string;

    @ApiProperty()
    @IsDefined()
    @IsString()
    value: string;
}

export class UpdateMailTemplateDto extends CreateMailTemplateDto {
    @ApiProperty()
    @IsDefined()
    @IsMongoId()
    _id: string;
}

export interface IBackendMailerEmailAddress {
    name: string;
    address: string;
}
