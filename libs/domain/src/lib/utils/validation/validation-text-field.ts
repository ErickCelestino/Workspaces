import { EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';

export async function ValidationTextField(
  field: string,
  fieldName: string
): Promise<Either<EntityNotEmpty, void>> {
  if (!field || field.trim().length === 0) {
    return left(new EntityNotEmpty(fieldName));
  }
  return right(undefined);
}
