import { PartialType } from '@nestjs/swagger';
import { CreateNanoregDto } from './create-nanoreg.dto';

export class UpdateNanoregDto extends PartialType(CreateNanoregDto) {}
