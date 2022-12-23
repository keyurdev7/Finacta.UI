export class Companies {
  objNotificationCount: {
    unreadMessageCount: number;
    unacknowledgedCount: number;
  } = {
    unreadMessageCount: 0,
    unacknowledgedCount: 0,
  };
  lstUserCompany: {
    companyId: string | number;
    companyName: string;
    unreadMessageCount: string | number;
  }[] = [];
}
