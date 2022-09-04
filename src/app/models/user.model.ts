import { Transform } from 'class-transformer';
import { momentTransform } from '../shared/utils/date.utils';
import { AccessMenuHeader } from './access-menu-header.model';
import { Company } from './company.model';

export class User {
  accessMenu: AccessMenuHeader[] = [];
  companyId: number = 0;
  companyName: string = '';
  emailId: string = '';
  errors: string = '';
  firstName: string = '';
  isActive?: boolean = false;
  isDeleted?: boolean = false;
  isEmailverified?: boolean = false;
  isPortalSubscibe?: boolean = false;
  isTemporaryPassword?: boolean = false;
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  joinedDate: string = '';
  lastLoginCompanyId: number = 0;
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  lastLoginDateTime: string = '';
  lastName: string = '';
  marketingEmails?: boolean = false;
  phoneNumber: string = '';
  position: string = '';
  profilePhoto: string = '';
  refreshToken: string = '';
  success?: boolean = false;
  token: string = '';
  userId: number = 0;
  userTypeId: number = 0;
  userCompany: Company[] = [];

  getFullName(): string {
    return this.firstName + ' ' + this.lastName;
  }
}
