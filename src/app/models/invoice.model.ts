import { Transform } from 'class-transformer';
import { momentTransform } from '../shared/utils/date.utils';

export class Invoice {
  invoiceId: number = 0;
  userId: number = 0;
  companyId: number = 0;
  invoiceType: string = '';
  invoiceNumber: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  invoiceDate: string = '';
  invoiceAmount: number = 0;
  invoiceStatus: string = '';
  invoiceXeroUrl: string = '';
  createdByUserName: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  createdDateTime: string = '';
  updatedByUserName: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  updatedDateTime: string = '';
}
