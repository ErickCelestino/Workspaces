/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AdmLoginService } from './adm-login.service';
import { LocalAuthGuard } from '@workspaces/data-access';
import { ErrorMessageResult } from '@workspaces/domain';

@Controller('auth')
export class AdmLoginController {
  constructor(private readonly authService: AdmLoginService) {}

  @UseGuards(LocalAuthGuard)
  @Post('adm-login')
  async login(@Request() req: any) {
    const result = await this.authService.login(req.user);

    if (result.isRight()) return result.value;
    else await ErrorMessageResult(result.value.name, result.value.message);
  }
}
