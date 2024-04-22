import { Inject } from '@nestjs/common';
import { ValidateCNPJRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class ValidateCNPJRepositoryImpl implements ValidateCNPJRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}
  async validate(input: string): Promise<boolean> {
    input = input.replace(/\D/g, '');

    if (input.length !== 14) {
      return false;
    }

    if (/^(\d)\1+$/.test(input)) {
      return false;
    }

    let soma = 0;
    let peso = 2;
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(input.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    const digitoVerificador1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (parseInt(input.charAt(12)) !== digitoVerificador1) {
      return false;
    }

    soma = 0;
    peso = 2;
    for (let i = 12; i >= 0; i--) {
      soma += parseInt(input.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    const digitoVerificador2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (parseInt(input.charAt(13)) !== digitoVerificador2) {
      return false;
    }

    return true;
  }
}
