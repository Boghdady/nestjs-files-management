import { Module } from '@nestjs/common';
import { FilesUploadController } from './files-upload.controller';

@Module({
  controllers: [FilesUploadController],
})
export class FilesUploadModule {}
