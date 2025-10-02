import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';

// يستخدم PartialType لجعل جميع خصائص CreateClientDto اختيارية لعملية التحديث (PATCH)
export class UpdateClientDto extends PartialType(CreateClientDto) {}