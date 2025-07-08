import {BadRequestException, Injectable} from "@nestjs/common";
import { MailTemplateService } from "./mail-template.service";
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Resend } from "resend";
import { BackendMailBuilder } from "../helpers/mail-builder.class";

@Injectable()
export class MailerService {
    private resend: Resend;

    constructor(
        private readonly mailTemplateService: MailTemplateService,
        private readonly config: ConfigService,
    ) {
        this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    }

    async fromTemplate(
        templateId: string,
        params?: {  [key: string]: any; },
    ): Promise<BackendMailBuilder> {
        const template =
            await this.mailTemplateService.compileMailTemplateById(templateId);
        if (!template) {
            throw new BadRequestException(`Template ID: ${templateId} not found`);
        }
        return new BackendMailBuilder(template(params).toString());
    }

    async send(opts: nodemailer.SendMailOptions) {
        return await this.resend.emails.send({
            from: this.config.get<string>('MAIL_FROM'),
            to: opts.to as string[],
            subject: opts.subject,
            html: opts.html as string,
        });
    }
}
