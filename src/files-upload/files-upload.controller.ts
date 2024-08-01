import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from '../shared/files/files-validation-factory';
import { MaxFileCount } from '../shared/files/constants/file-count.constants';

type File = Express.Multer.File;
@Controller('files-upload')
export class FilesUploadController {
  constructor() {}

  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(createParseFilePipe('2MB', ['png']))
    file: File,
  ) {
    return file;
  }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files', MaxFileCount.PRODUCTS_IMAGES))
  uploadFiles(
    @UploadedFiles(createParseFilePipe('2MB', ['png', 'jpeg', 'pdf']))
    files: File[],
  ) {
    return files.map((file) => file.originalname);
  }
}
