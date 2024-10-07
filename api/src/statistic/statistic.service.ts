import * as excel from 'exceljs';
import { Injectable } from '@nestjs/common';

import { GENERAL_STYLE, REPORTS_STYLE } from './styles';
import { ReportType, DownloadReportFile } from './types';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class StatisticService {
  constructor(private prisma: PrismaService) {}

  async getReports(days: Array<Date>): Promise<Array<ReportType>> {
    return await Promise.all(
      days.map(async (day) => {
        const statisticData = await this.prisma
          .$queryRaw`SELECT ${day}::timestamp AS day,
          CAST(SUM(credits) AS INTEGER) AS "creditsAllClasses",
          CAST(SUM(CASE WHEN name = 'infinity-conversation-lesson' THEN credits ELSE 0 END) AS INTEGER) AS "creditsInfinityConversationLesson",
          CAST(SUM(CASE WHEN name = 'universal-expressions-lesson' THEN credits ELSE 0 END) AS INTEGER) AS "creditsUniversalExpressionsLesson",
          CAST(SUM(CASE WHEN name = 'phrasal-verbs-lesson' THEN credits ELSE 0 END) AS INTEGER) AS "creditsPhrasalVerbsLesson",
          CAST(SUM(CASE WHEN name = 'wise-proverbs-lesson' THEN credits ELSE 0 END)  AS INTEGER) AS "creditsWiseProverbsLesson"
          FROM lessons JOIN "lessonStructures" ON lessons."lessonStructureId" = "lessonStructures".id
          WHERE DATE(lessons."createdAt") = ${day}::date AND lessons.status = 'completed'
          `;

        return statisticData[0];
      }),
    );
  }

  async downloadReports(date: Date): Promise<DownloadReportFile> {
    const days = GENERAL_STYLE.getLastDays(date, 30);
    const reports = await this.getReports(days);

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet(REPORTS_STYLE.worksheetName);
    worksheet.addRow(REPORTS_STYLE.worksheetTitles);
    const FIRST_ROW = 1;
    worksheet.getRow(FIRST_ROW).eachCell((cell) => {
      cell.font = REPORTS_STYLE.header.font;
    });
    for (let rowNumber = 0; rowNumber < reports.length; rowNumber++) {
      worksheet.addRow([
        reports[rowNumber].day,
        reports[rowNumber].creditsAllClasses || 0,
        reports[rowNumber].creditsInfinityConversationLesson || 0,
        reports[rowNumber].creditsPhrasalVerbsLesson || 0,
        reports[rowNumber].creditsUniversalExpressionsLesson || 0,
        reports[rowNumber].creditsWiseProverbsLesson || 0,
      ]);
      const DATE_CELL = rowNumber + 2;
      const dateCell = worksheet.getCell('A' + DATE_CELL);
      dateCell.numFmt = GENERAL_STYLE.dateFormat;
    }
    GENERAL_STYLE.editCellsWidth(worksheet);

    const file = await workbook.xlsx.writeBuffer();
    const name = REPORTS_STYLE.createName(days);
    return { file, name };
  }
}
