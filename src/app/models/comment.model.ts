import { Transform } from 'class-transformer';
import { momentTransform } from '../shared/utils/date.utils';

export class Comment {
  blogCommentId: number = 0;
  blogId: number = 0;
  userId: number = 0;
  comment: string = '';
  parentBlogCommentId: number = 0;
  createdByUserName: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  createdDateTime: string = '';
  profilePhoto: string = '';
}
