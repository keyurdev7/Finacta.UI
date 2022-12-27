import { HeaderCompanies } from './header-companies.model';
export class Companies {
  objNotificationCount: {
    unreadMessageCount: number;
    unacknowledgedCount: number;
  } = {
    unreadMessageCount: 0,
    unacknowledgedCount: 0,
  };
  lstUserCompany: HeaderCompanies[] = [];
}
