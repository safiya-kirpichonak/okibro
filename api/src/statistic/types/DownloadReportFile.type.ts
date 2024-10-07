import * as excel from 'exceljs';

export type DownloadReportFile = {
  file: excel.Buffer;
  name: string;
};
