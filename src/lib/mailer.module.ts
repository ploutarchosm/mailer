import { Module, OnModuleInit, Logger, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validateMailerConfig, MailerConfigDto } from './helpers/mailer-config.validation';
import { MongooseModule } from "@nestjs/mongoose";
import { MailTemplate, MailTemplateSchema } from "./schema/mail-template.schema";
import { MailTemplateService } from "./services/mail-template.service";
import { MailerController } from "./controllers/mailer.controller";
import { MailerService } from "./services/mailer.service";
import { ValidateSystemRepositoryModelPipe } from "@ploutos/common";

@Module({})
export class MailerModule implements OnModuleInit {
    private readonly logger = new Logger(MailerModule.name);
    private static config: MailerConfigDto;

    static forRoot(): DynamicModule {
        return {
            module: MailerModule,
            imports: [
                MongooseModule.forFeature([
                    { name: MailTemplate.name, schema: MailTemplateSchema },
                ]),
            ],
            controllers: [MailerController],
            providers: [
                {
                    provide: 'MAILER_CONFIG',
                    useFactory: (configService: ConfigService) => {
                        // Validate configuration at module initialization
                        this.config = validateMailerConfig({
                            apiKey: configService.get<string>('RESEND_API_KEY'),
                            fromEmail: configService.get<string>('MAIL_FROM'),
                            replyTo: configService.get<string>('MAIL_REPLY_TO'),
                        });

                        return this.config;
                    },
                    inject: [ConfigService],
                },
                ValidateSystemRepositoryModelPipe,
                MailTemplateService,
                MailerService
            ],
            exports: ['MAILER_CONFIG'],
        };
    }

    onModuleInit() {
        this.logger.log('Mailer module initialized with validated configuration');
    }
}
