import React, { useEffect, useState } from "react";

import MainButton from "../../../components/main-button";
import StatisticService from "../../../../services/StatisticService";

const ReportsSection = () => {
  const [daysAgo, setDaysAgo] = useState(0);
  const [reports, setReports] = useState([]);
  const [firstDay, setFirstDay] = useState(new Date());

  useEffect(() => {
    async function getRoles() {
      const todayDateTime = new Date(firstDay);
      const yesterdayDateTime = new Date();
      yesterdayDateTime.setDate(todayDateTime.getDate() - 1);
      const twoDaysAgoDateTime = new Date();
      twoDaysAgoDateTime.setDate(todayDateTime.getDate() - 2);

      const today = todayDateTime.toISOString().split("T")[0];
      const yesterday = yesterdayDateTime.toISOString().split("T")[0];
      const twoDaysAgo = twoDaysAgoDateTime.toISOString().split("T")[0];

      const responce = await StatisticService.getReports(
        today,
        yesterday,
        twoDaysAgo
      );

      setReports(responce.data.data);
    }
    getRoles();
  }, [firstDay]);

  const onClickBack = () => {
    const tempDaysAgo = daysAgo + 2;
    const tempFirstDay = new Date(firstDay);
    tempFirstDay.setDate(new Date(firstDay).getDate() - 2);
    setFirstDay(tempFirstDay);
    setDaysAgo(tempDaysAgo);
  };

  const onClickNext = () => {
    if (daysAgo !== 0) {
      const tempDaysAgo = daysAgo - 2;
      const tempFirstDay = new Date(firstDay);
      tempFirstDay.setDate(new Date(firstDay).getDate() + 2);
      setFirstDay(tempFirstDay);
      setDaysAgo(tempDaysAgo);
    }
  };

  const onClickDownload = async () => {
    const response = await StatisticService.downloadReports();
    const contentDisposition = response.headers["content-disposition"];
    const fileNameMatch = contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : "file.xlsx";
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("download", fileName);
    link.href = url;
    link.click();
  };

  return (
    <div className="single-tab-content">
      <div className="row">
        <div className="col-12">
          <div className="row mb-3">
            <div className="col-12">
              <div style={{ margin: "0 0 20px 0" }}>
                <MainButton text="Download" onClick={onClickDownload} />
              </div>
              <div className="single-schedule-info">
                <p>*Date - reporting date</p>
                <p>*CS - Credits spent in reporting period</p>
                <p>
                  *C"IC" - Credits spent in "Infinity conversation" module in
                  reporting period
                </p>
                <p>
                  *C"PV" - Credits spent in "Phrasal verbs" module in reporting
                  period
                </p>
                <p>
                  *C"UE" - Credits spent in "Universal expressions" module in
                  reporting period
                </p>
                <p>
                  *C"WP" - Credits spent in "Wise proverbs" module in reporting
                  period
                </p>
              </div>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-1">
              <div className="single-schedule-info">
                <h6>Date</h6>
              </div>
            </div>
            <div className="col-1">
              <div className="single-schedule-info">
                <h6>CS</h6>
              </div>
            </div>
            <div className="col-1">
              <div className="single-schedule-info">
                <h6>C"IC"</h6>
              </div>
            </div>
            <div className="col-1">
              <div className="single-schedule-info">
                <h6>C"PV"</h6>
              </div>
            </div>
            <div className="col-1">
              <div className="single-schedule-info">
                <h6>C"UE"</h6>
              </div>
            </div>
            <div className="col-1">
              <div className="single-schedule-info">
                <h6>C"WP"</h6>
              </div>
            </div>
          </div>
          {reports.map(
            (
              {
                creditsInfinityConversationLesson,
                creditsUniversalExpressionsLesson,
                creditsPhrasalVerbsLesson,
                creditsWiseProverbsLesson,
                creditsAllClasses,
                day,
              },
              index
            ) => {
              return (
                <div className="row mb-3" key={index}>
                  <div className="col-1">
                    <div className="single-schedule-info">
                      <p>{new Date(day).toISOString().split("T")[0]}</p>
                    </div>
                  </div>
                  <div className="col-1">
                    <div className="single-schedule-info">
                      <p>{creditsAllClasses || 0}</p>
                    </div>
                  </div>
                  <div className="col-1">
                    <div className="single-schedule-info">
                      <p>{creditsInfinityConversationLesson || 0}</p>
                    </div>
                  </div>
                  <div className="col-1">
                    <div className="single-schedule-info">
                      <p>{creditsPhrasalVerbsLesson || 0}</p>
                    </div>
                  </div>
                  <div className="col-1">
                    <div className="single-schedule-info">
                      <p>{creditsUniversalExpressionsLesson || 0}</p>
                    </div>
                  </div>
                  <div className="col-1">
                    <div className="single-schedule-info">
                      <p>{creditsWiseProverbsLesson || 0}</p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className="col-12">
          <div
            className="more-schedule-btn text-center mt-50 wow fadeInUp"
            data-wow-delay="300ms"
          >
            <MainButton text="Next" onClick={onClickNext} />
            <MainButton
              text="Back"
              onClick={onClickBack}
              style={{ marginLeft: "20px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
