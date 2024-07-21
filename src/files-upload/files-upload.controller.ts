import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

type File = Express.Multer.File;
@Controller('files-upload')
export class FilesUploadController {
  constructor() {}

  @Post('/single')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 200, // 200 bytes
      },
    }),
  )
  uploadFile(@UploadedFile() file: File) {
    // this.awsS3.uploadSingleFiles(file);
    return file;
  }

  @Post('/multiple')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  uploadFiles(@UploadedFiles() files: File[]) {
    // this.awsS3.uploadMultipleFiles(files);
    return files.map((file) => file.originalname);
  }
}
