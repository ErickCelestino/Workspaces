import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@workspaces/data-access';

@Controller('hellow-word')
export class HellowWordController {
  @UseGuards(JwtAuthGuard)
  @Get('/hellow-word')
  getHellowWord() {
    return 'Hellow Word';
  }
}
