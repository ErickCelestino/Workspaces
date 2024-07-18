import { ConvertStringInTimeRepository } from '@workspaces/domain';

export class ConvertStringInTimeRepositoryImpl
  implements ConvertStringInTimeRepository
{
  convert(input: string): Date {
    const [hour, minute] = input.split(':').map(Number);

    const now = new Date();

    const dateTimeLocal = new Date(now);
    dateTimeLocal.setHours(hour, minute, 0, 0);

    return dateTimeLocal;
  }
}
