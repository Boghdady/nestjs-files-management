import {
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileSignatureValidator } from './validators/file-signature.validator';
import { FileValidator } from '@nestjs/common/pipes/file/file-validator.interface';
import { FileType } from './types/file.types';
import { createFileTypeRegex } from './utils/file.util';

const createFileValidators = (
  maxSize: number,
  fileTypes: FileType[],
): FileValidator[] => {
  const fileTypeRegex = createFileTypeRegex(fileTypes);
  return [
    // 1) validate file size
    new MaxFileSizeValidator({
      maxSize, // 2MB
      message: (maxSize) =>
        `File is too big. Max file size is ${maxSize} bytes`,
    }),

    // 2) validate file type (extension)
    new FileTypeValidator({
      fileType: fileTypeRegex,
    }),

    // 3) custom validation (validate file signature)
    new FileSignatureValidator(),
  ];
};

export const createParseFilePipe = (
  maxSize: number,
  fileTypes: FileType[],
): ParseFilePipe =>
  new ParseFilePipe({
    validators: createFileValidators(maxSize, fileTypes),
    errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    exceptionFactory: (error: string) => {
      throw new UnprocessableEntityException(error);
    },
    fileIsRequired: true,
  });
