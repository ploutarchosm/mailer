import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    collection: 'mail_templates',
    timestamps: true,
    versionKey: false,
})
export class MailTemplate extends Document {
    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    application: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxlength: [2, 'Language must be exactly 2 characters'],
        minlength: [2, 'Language must be exactly 2 characters'],
        validate: {
            validator: function (v: string) {
                return /^[a-z]{2}$/.test(v);
            },
            message:
                'Language code must be exactly 2 lowercase letters (e.g., en, fr, es)',
        },
    })
    language: string;

    @Prop({
        type: String,
        required: true,
    })
    value: string;
}

export const MailTemplateSchema = SchemaFactory.createForClass(MailTemplate);
