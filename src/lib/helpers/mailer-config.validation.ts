import { IsEmail, IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class MailerConfigDto {
    @IsString()
    @IsNotEmpty({ message: 'RESEND_API_KEY is required for Mailer module' })
    apiKey: string;

    @IsString()
    @IsNotEmpty({ message: 'MAIL_FROM is required for Mailer module' })
    fromEmail: string;

    @IsString()
    @IsOptional()
    replyTo?: string;
}

export function validateMailerConfig(config: Record<string, any>): MailerConfigDto {
    const validatedConfig = plainToClass(MailerConfigDto, config);
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        const errorMessages = errors
            .map(error => Object.values(error.constraints || {}).join(', '))
            .join('; ');
        throw new Error(`Mailer configuration validation failed: ${errorMessages}`);
    }

    return validatedConfig;
}
