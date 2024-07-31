import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from '../shared/files/files-validation-factory';

type File = Express.Multer.File;
@Controller('files-upload')
export class FilesUploadController {
  constructor() {}

  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(createParseFilePipe(2 * 1024 * 1024, /jpg|pdf|png/))
    file: File,
  ) {
    return file;
  }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files', 3))
  uploadFiles(
    @UploadedFiles(createParseFilePipe(2 * 1024 * 1024, /jpg|pdf|png/))
    files: File[],
  ) {
    return files.map((file) => file.originalname);
  }
}
