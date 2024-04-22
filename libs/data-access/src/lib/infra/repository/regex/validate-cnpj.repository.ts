import { ValidateCNPJRepository } from '@workspaces/domain';

export class ValidateCNPJRepositoryImpl implements ValidateCNPJRepository {
  validate(input: string): boolean {
    const b: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const c: string = String(input).replace(/[^\d]/g, '');

    if (c.length !== 14 || /(.)\1{13}/.test(c)) return false;

    function calculateDigitSum(digits: string, multipliers: number[]): number {
      return digits
        .split('')
        .map((digit, index) => parseInt(digit) * multipliers[index])
        .reduce((acc, curr) => acc + curr, 0);
    }

    const firstDigitSum = calculateDigitSum(c.substring(0, 12), b.slice(1));
    const firstDigit = parseInt(c[12]);
    const calculatedFirstDigit =
      firstDigitSum % 11 < 2 ? 0 : 11 - (firstDigitSum % 11);
    if (firstDigit !== calculatedFirstDigit) return false;

    const secondDigitSum = calculateDigitSum(c.substring(0, 13), b);
    const secondDigit = parseInt(c[13]);
    const calculatedSecondDigit =
      secondDigitSum % 11 < 2 ? 0 : 11 - (secondDigitSum % 11);
    if (secondDigit !== calculatedSecondDigit) return false;

    return true;
  }
}
