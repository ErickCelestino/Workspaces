import { CreateCompanyDto, createCompanySchema } from '@workspaces/domain';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateCompanyService } from './create-company.service';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

@Controller('create-company')
export class CreateCompanyController {
  constructor(private readonly createCompanyService: CreateCompanyService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCompanySchema))
  async create(@Body() input: CreateCompanyDto) {
    const result = await this.createCompanyService.create(input);

    if (result.isRight()) return;
    else
      throw new BadRequestException({
        error: {
          name: result.value.name,
          message: result.value.message,
        },
      });
  }
}
