export class AddEditBlogForm {
  BlogId?: number = 0;
  CategoryId: number = 0;
  BlogTitle: string = '';
  BlogContents: string = '';
  BlogShortContents: string = '';
  BlogImage?: File;
  RemoveBlogImage?: boolean = false;
}
