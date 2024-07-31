import { FileType } from '../types/file.types';

export const createFileTypeRegex = (fileTypes: FileType[]): RegExp =>
  new RegExp(fileTypes.join('|'));
