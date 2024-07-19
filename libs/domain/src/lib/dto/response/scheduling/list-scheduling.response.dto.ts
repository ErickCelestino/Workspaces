import { Scheduling } from '../../../entity';

export interface ListSchedulingReponseDto {
  total: number;
  filteredTotal: number;
  totalPages: number;
  scheduling: Scheduling[];
}
