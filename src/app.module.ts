import { Module } from '@nestjs/common';
import { FilesUploadModule } from './files-upload/files-upload.module';

@Module({
  imports: [FilesUploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
