import { PartialType } from '@nestjs/mapped-types';
import { CreateTourDto } from './create-tour.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateTourDto extends PartialType(CreateTourDto) {}
