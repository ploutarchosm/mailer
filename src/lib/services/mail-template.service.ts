import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as handlebars from 'handlebars';
import {Model, Types} from 'mongoose';
import { MailTemplate } from '../schema/mail-template.schema';
import { CreateMailTemplateDto, UpdateMailTemplateDto } from "../dto/mail-template.dto";

@Injectable()
export class MailTemplateService {
    constructor(
        @InjectModel(MailTemplate.name)
        private mailTemplateModel: Model<MailTemplate>,
    ) {
        handlebars.registerHelper('concat', (...args) => {
            args.pop();
            return args.join('');
        });
    }

    /**
     * @description Get mail templates using skip & limit
     * @param take
     * @param skip
     * @param search
     */
    async list(take: number, skip: number, search?: string) {
        let searchQuery: any;

        if (search) {
            searchQuery = search
                ? {
                    $or: [{ application: { $regex: search, $options: 'i' } }],
                }
                : {};
        }

        const list = await this.mailTemplateModel
            .find(searchQuery)
            .skip(skip)
            .limit(take)
            .exec();

        const totalItems = await this.mailTemplateModel.countDocuments().exec();

        return {
            data: list,
            count: search ? list.length : totalItems,
        };
    }

    /**
     * @description Get mail template by id
     * @param id
     */
    async getById(id: string) {
        return this.mailTemplateModel.findOne({ _id: id }).exec();
    }

    async compileMailTemplateById(id: string) {
        const template = await this.mailTemplateModel
            .findOne({
                application: id,
            })
            .exec();
        if (!template) {
            throw new BadRequestException(`Template ID: ${id} not found`);
        }
        return handlebars.compile(template.value);
    }

    /**
     * @description Create new mail template
     * @param dto
     */
    async create(dto: CreateMailTemplateDto) {
        return new this.mailTemplateModel(dto).save();
    }

    /**
     * @description Delete mail template
     * @param byId
     */
    async delete(byId: Types.ObjectId) {
        return this.mailTemplateModel.deleteOne({ _id: byId }).exec();
    }

    /**
     * @description Update mail template
     * @param dto
     */
    async update(dto: UpdateMailTemplateDto) {
        return this.mailTemplateModel
            .updateOne(
                { _id: dto._id },
                {
                    application: dto.application,
                    language: dto.language,
                    value: dto.value,
                },
                { upsert: true, new: true },
            )
            .exec();
    }

    /**
     * @description Get number of all templates in db
     */
    async count() {
        return this.mailTemplateModel.countDocuments().exec();
    }
}
