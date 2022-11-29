import { Transform } from 'class-transformer';
import { momentTransform } from '../shared/utils/date.utils';

export class File {
  recordId: number = 0;
  recordType: string = '1';
  recordName: string = '';
  blobFilePath: string = '';
  fileType: string = '';
  fileSize: number = 0;
  fileSizeType: string = '';
  createdBy: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  createdDateTime: string = '';
  documentStatus: string = '';
  modifiedBy: string = '';
  approvedBy: string = '';
}
