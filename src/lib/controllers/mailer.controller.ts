import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { MailTemplateService } from "../services/mail-template.service";
import { MailerService } from "../services/mailer.service";
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { CreateMailTemplateDto, UpdateMailTemplateDto } from "../dto/mail-template.dto";
import { Permissions, ADMIN, AuthorizedGuard, PermissionsGuard, SECURITY_API_TOKEN_HEADER_KEY, IListQuery, ValidateSystemRepositoryModelPipe } from '@ploutos/common';
import { Types } from "mongoose";

@ApiTags('Mailer')
@ApiSecurity(SECURITY_API_TOKEN_HEADER_KEY)
@UseGuards(AuthorizedGuard, PermissionsGuard)
@Controller('common/mailer')
export class MailerController {
    constructor(
        private readonly mailTemplateService: MailTemplateService,
        private readonly mailerService: MailerService
    ) {}

    @Post('template')
    @ApiOperation({ summary: 'Create a new email template.' })
    @Permissions(ADMIN)
    async create(
        @Body(new ValidationPipe({ transform: true })) data: CreateMailTemplateDto,
    ) {
        return await this.mailTemplateService.create(data);
    }

    @Get('template/:id')
    @ApiOperation({ summary: 'Get email template using id.' })
    @Permissions(ADMIN)
    async read(@Param('id') id: string) {
        return this.mailTemplateService.getById(id);
    }

    @Put('template')
    @ApiOperation({ summary: 'Update email template by id.' })
    @Permissions(ADMIN)
    async update(
        @Body(new ValidationPipe({ transform: true })) data: UpdateMailTemplateDto,
    ) {
        return await this.mailTemplateService.update(data);
    }

    @Delete('template/:id')
    @ApiOperation({ summary: 'Delete email template by id.' })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'MongoDB ObjectId',
        example: '507f1f77bcf86cd799439011'
    })
    @Permissions(ADMIN)
    async delete(
        @Param('id', ValidateSystemRepositoryModelPipe) id: Types.ObjectId
    ) {
        return await this.mailTemplateService.delete(id);
    }

    @Get('template')
    @ApiOperation({ summary: 'Get all email template with query.' })
    @Permissions(ADMIN)
    async list(
        @Query(ValidationPipe) params: IListQuery,
    ) {
        return this.mailTemplateService.list(
            params.take,
            params.skip,
            params.search,
        );
    }
}
