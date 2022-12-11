import { Transform } from 'class-transformer';
import { momentTransform } from '../shared/utils/date.utils';

export class CompanyUser {
  userId: number = 0;
  emailId: string = '';
  firstName: string = '';
  lastName: string = '';
  profilePhoto: string = '';
  phoneNumber: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  lastLoginDateTime: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  joinedDate: string = '';
  invitationStatusName: string = '';
  userActiveStatus: string = '';
  userDeleteStatus: string = '';
  userActiveStatusId? :boolean = false;
  companyName:string ='';
  userType: string = '';
}
