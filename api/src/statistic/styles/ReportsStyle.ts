export const REPORTS_STYLE = {
  worksheetName: 'Reports',
  worksheetTitles: ['Date', 'CS', 'C"IC"', 'C"PV"', 'C"UE"', 'C"WP"'],
  header: {
    font: { bold: true, size: 14 },
  },
  createName(days: Array<Date>): string {
    const startDate = days[0].toISOString().split('T')[0];
    const endDate = days[days.length - 1].toISOString().split('T')[0];
    return `${startDate} - ${endDate}.xlsx`;
  },
};
