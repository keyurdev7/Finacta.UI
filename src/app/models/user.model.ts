import { Transform } from 'class-transformer';
import { momentTransform } from '../shared/utils/date.utils';
import { AccessMenuHeader } from './access-menu-header.model';
import { Company } from './company.model';
import { UserTheme } from './user-theme.model';

export class User {
  accessMenu: AccessMenuHeader[] = [];
  companyId: number = 0;
  companyName: string = '';
  collapseLogo: string = '';
  expandLogo: string = '';
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
  position?: string = '';
  profilePhoto: string = '';
  refreshToken: string = '';
  success?: boolean = false;
  token: string = '';
  userId: number = 0;
  userTypeId: number = 0;
  userTypeName: string = '';
  userActiveStatusId?: boolean = false;
  userCompany: Company[] = [];
  fileManagementListView?: boolean = true;
  isSidebarOpen?: boolean = false;
  userTheme: UserTheme = new UserTheme();

  getFullName(): string {
    return this.firstName + ' ' + this.lastName;
  }
}

export class UserActiveInactive1 {
  id: number = 0;
  userActiveStatusId?: boolean = false;
}
