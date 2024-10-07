import * as excel from 'exceljs';

export const GENERAL_STYLE = {
  dateFormat: 'dd-mm-yyyy',
  getLastDays(firstDay: Date, daysNumber: number): Array<Date> {
    const days = [];
    for (let numberDayAgo = 0; numberDayAgo < daysNumber; numberDayAgo++) {
      const previousDay = new Date(firstDay);
      previousDay.setDate(previousDay.getDate() - numberDayAgo);
      days.push(previousDay);
    }
    return days.reverse();
  },
  editCellsWidth(worksheet: excel.Worksheet): void {
    worksheet.columns.forEach((column) => {
      let maxWidth = 10;
      column.eachCell((cell) => {
        const columnWidth = cell.value?.toString().length || maxWidth;
        if (columnWidth > maxWidth) maxWidth = columnWidth;
      });
      column.width = maxWidth;
    });
  },
};
