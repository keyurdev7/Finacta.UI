import { Transform } from 'class-transformer';
import { momentTransform } from '../shared/utils/date.utils';

export class PromoCode {
  promoCodeId: number = 0;
  promoCode: string = '';
  emailId: string = '';
  promoDays: number = 0;
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  promoStartDate: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  promoEndDate: string = '';
  promoActivated: boolean = false;
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  promoActivatedDate: string = '';
}
