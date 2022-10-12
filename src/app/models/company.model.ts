export class Company {
  companyId: number = 0;
  companyName: string = '';
  xeroContactName: string = '';
  companyNumber?: string = '';
  SubscriptionStartDateTime?: string = '';
  SubscriptionEndDateTime?: string = '';
}


export class PaymentHistory {
  PaymentId: number = 0;
  Amount: number = 0;
  SubscriptionStartDateTime?: string = '';
  SubscriptionEndDateTime?: string = '';
  PaymentStatus: string ='';
  PaymentErrorText : string = '';
  FinactaUniqueId : string = '';
  StripeSessionId : string = '';
}