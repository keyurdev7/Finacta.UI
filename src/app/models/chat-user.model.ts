import { Transform } from 'class-transformer';
import { momentTransform } from '../shared/utils/date.utils';

export class ChatUser {
  userId: number = 0;
  name: string = '';
  unReadCount: number = 0;
  chatSessionId: number = 0;
  userType: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  lastMessageSentDateTime: string = '';
  lastMessageText: string = '';
  profilePhoto: string = '';
}
