import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from '@workspaces/data-access';

@Controller('refresh')
export class refreshController {
  @UseGuards(JwtRefreshAuthGuard)
  @Post('/hellow-word')
  getHellowWord() {
    return 'Hellow Word';
  }
}
