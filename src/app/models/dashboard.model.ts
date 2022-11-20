import { Transform } from 'class-transformer';
import { momentTransform } from '../shared/utils/date.utils';

export class DashBoard {
    reportId: string = '';
    accessToken: string = '';
    embedUrl: string = '';
}