import { Transform } from 'class-transformer';
import { momentTransform } from '../shared/utils/date.utils';

export class Blog {
  blogId: number = 0;
  blogCommentCount: number = 0;
  userId: number = 0;
  blogTitle: string = '';
  blogContents: string = '';
  blogShortContents: string = '';
  categoryId: number = 0;
  categoryName: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  publishedDateTime: string = '';
  createdByUserName: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  createdDateTime: string = '';
  profilePhoto: string = '';
  updatedByUserName: string = '';
  @Transform(({ value }) => momentTransform(value), { toClassOnly: true })
  updatedDateTime: string = '';
}
