import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
        imports: [PrismaModule],
        providers: [UploadService],
        controllers: [UploadController]
     
})
export class UploadModule {}
