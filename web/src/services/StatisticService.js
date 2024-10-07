import $host from "../axios";

export default class StatisticService {
  static async getReports(day1, day2, day3) {
    return await $host.get(
      `/statistic/reports?days[]=${day1}&days[]=${day2}&days[]=${day3}`
    );
  }

  static async downloadReports() {
    return await $host.post(
      "/statistic/reports/download",
      {
        date: new Date(),
      },
      {
        responseType: "arraybuffer",
      }
    );
  }
}
