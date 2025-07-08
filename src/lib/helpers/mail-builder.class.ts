import * as nodemailer from 'nodemailer';
import { v4 } from 'uuid';
import { IBackendMailerEmailAddress } from "../dto/mail-template.dto";

export class BackendMailBuilder {
    public readonly id = v4();

    private _text: string;
    private _from: IBackendMailerEmailAddress | string;
    private _subject: string;
    private readonly _recipients: (IBackendMailerEmailAddress | string)[] = [];

    constructor(private _html: string) {}

    from(email: IBackendMailerEmailAddress | string) {
        this._from = email;
        return this;
    }

    subject(subject: string) {
        this._subject = subject;
        return this;
    }

    html(html: string) {
        this._html = html;
        return this;
    }

    text(text: string) {
        this._text = text;
        return this;
    }

    addRecipient(recipient: IBackendMailerEmailAddress | string) {
        this._recipients.push(recipient);
        return this;
    }

    build(): nodemailer.SendMailOptions {
        return {
            messageId: this.id,
            from: this._from,
            to: this._recipients,
            subject: this._subject,
            text: this._text,
            html: this._html,
        };
    }
}
