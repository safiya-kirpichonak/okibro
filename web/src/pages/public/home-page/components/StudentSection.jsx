import React, { useEffect, useState } from "react";

import StartLessonSection from "./StartLessonSection";
import { WALLET_ROUTE } from "../../../../routes/const";
import okibroMessages from "../../../../data/messages.json";
import LessonService from "../../../../services/LessonService";


const StudentSection = () => {
  const [structure, setStructure] = useState("");
  const [availableStructures, setAvailableStructures] = useState([]);

  const getStatus = async () => {
    const response = await LessonService.getStatus();
    setAvailableStructures(response.data.data.availableStructures);
    setStructure(response.data.data.structure);
  };

  const getButtonText = (buttonStructure) => {
    if (!availableStructures.includes(buttonStructure)) return "Buy credits";
    return structure === "no-structure" || structure !== buttonStructure
      ? "Start"
      : "Continue";
  };

  const getButtonOnClick = (buttonStructure) => {
    const onStartHandler = async (buttonStructure) => {
      if (structure === "no-structure" || structure === buttonStructure) {
        window.location.href = `/${buttonStructure}`;
        return;
      }

      const isStartNewLesson = window.confirm(
        okibroMessages["start-new-lesson-confirmation"]
      );
      if (isStartNewLesson) {
        await LessonService.stop();
        window.location.href = `/${buttonStructure}`;
      }
    };

    const onBuyHandler = () => {
      window.location.href = WALLET_ROUTE;
    };

    return !availableStructures.includes(buttonStructure)
      ? onBuyHandler()
      : onStartHandler(buttonStructure);
  };

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <section className="our-schedule-area bg-white section-padding-100">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="schedule-tab"></div>
            <div className="tab-content" id="conferScheduleTabContent">
              <div
                className="tab-pane fade show active"
                id="step-one"
                role="tabpanel"
                aria-labelledby="monday-tab"
              >
                <div className="single-tab-content">
                  <div className="row">
                    <div className="col-12">
                      <StartLessonSection
                        name="Infinity lesson"
                        description="Improve your conversational skills"
                        duration="10 minutes"
                        credits="1 credit"
                        button={{
                          text: getButtonText("infinity-conversation-lesson"),
                          onClick: () =>
                            getButtonOnClick("infinity-conversation-lesson"),
                        }}
                      />

                      <StartLessonSection
                        name="Phrasal verbs"
                        description="Learn phrasal verbs with Okibro"
                        duration="10 minutes"
                        credits="1 credit"
                        button={{
                          text: getButtonText("phrasal-verbs-lesson"),
                          onClick: () =>
                            getButtonOnClick("phrasal-verbs-lesson"),
                        }}
                      />

                      <StartLessonSection
                        name="Wise proverbs"
                        description="Learn wise proverbs with Okibro"
                        duration="10 minutes"
                        credits="1 credit"
                        button={{
                          text: getButtonText("wise-proverbs-lesson"),
                          onClick: () =>
                            getButtonOnClick("wise-proverbs-lesson"),
                        }}
                      />

                      <StartLessonSection
                        name="Universal expressions"
                        description="Learn universal expressions with Okibro"
                        duration="10 minutes"
                        credits="1 credit"
                        button={{
                          text: getButtonText("universal-expressions-lesson"),
                          onClick: () =>
                            getButtonOnClick("universal-expressions-lesson"),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentSection;
