import {
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileSignatureValidator } from './validators/file-signature.validator';
import { FileValidator } from '@nestjs/common/pipes/file/file-validator.interface';

const createFileValidators = (
  maxSize: number,
  fileType: RegExp | string,
): FileValidator[] => [
  // 1) validate file size
  new MaxFileSizeValidator({
    maxSize, // 2MB
    message: (maxSize) => `File is too big. Max file size is ${maxSize} bytes`,
  }),

  // 2) validate file type (extension)
  new FileTypeValidator({
    fileType,
  }),

  // 3) custom validation (validate file signature)
  new FileSignatureValidator(),
];

export const createParseFilePipe = (
  maxSize: number,
  fileType: RegExp | string,
): ParseFilePipe =>
  new ParseFilePipe({
    validators: createFileValidators(maxSize, fileType),
    errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    exceptionFactory: (error: string) => {
      throw new UnprocessableEntityException(error);
    },
    fileIsRequired: true,
  });
