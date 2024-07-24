import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileSignatureValidator } from '../shared/files/validators/file-signature.validator';

type File = Express.Multer.File;
@Controller('files-upload')
export class FilesUploadController {
  constructor() {}

  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 1) validate file size
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024, // 200Bytes
            message: (maxSize) =>
              `File is too big. Max file size is ${maxSize} bytes`,
          }),

          // 2) validate file type (extension)
          new FileTypeValidator({
            fileType: /jpg|pdf|png/,
          }),

          // 3) custom validation (validate file signature)
          new FileSignatureValidator(),
        ],
      }),
    )
    file: File,
  ) {
    // this.awsS3.uploadSingleFile(file);
    return file;
  }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files', 3))
  uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // 1) validate file size
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024, // 2MB
            message: (maxSize) =>
              `File is too big. Max file size is ${maxSize} bytes`,
          }),

          // 2) validate file type (extension)
          new FileTypeValidator({
            fileType: /png|jpg|pdf/,
          }),

          // 3) custom validation (validate file signature)
          new FileSignatureValidator(),
        ],
        errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        exceptionFactory: (error: string) => {
          console.log('error', error);
          throw new UnprocessableEntityException(error);
        },
        fileIsRequired: true,
      }),
    )
    files: File[],
  ) {
    // this.awsS3.uploadMultipleFiles(files);
    return files.map((file) => file.originalname);
  }
}
