import { IsNotEmpty } from 'class-validator';

export class DownloadReportsBody {
  @IsNotEmpty()
  date: Date;
}

export default DownloadReportsBody;
