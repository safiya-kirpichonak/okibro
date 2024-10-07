import React from "react";

import { HOME_ROUTE } from "../../../routes/const";
import { StatusCodes, ReasonPhrases } from "../../../helpers/http";

const ErrorPage = ({ status }) => {
  const getErrorBody = (status) => {
    switch (status) {
      case StatusCodes.NOT_FOUND:
        return (
          <div>
            <h1 style={{ textAlign: "center" }}>{StatusCodes.NOT_FOUND}</h1>
            <h4 style={{ textAlign: "center" }}>{ReasonPhrases.NOT_FOUND}</h4>
            <p style={{ textAlign: "center" }}>
              <a href={HOME_ROUTE}>Home</a>
            </p>
          </div>
        );
      case StatusCodes.FORBIDDEN:
        return (
          <div>
            <h1 style={{ textAlign: "center" }}>{StatusCodes.FORBIDDEN}</h1>
            <h4 style={{ textAlign: "center" }}>{ReasonPhrases.FORBIDDEN}</h4>
            <p style={{ textAlign: "center" }}>
              <a href={HOME_ROUTE}>Home</a>
            </p>
          </div>
        );
      default:
        return (
          <div>
            <h1 style={{ textAlign: "center" }}>
              {StatusCodes.INTERNAL_SERVER_ERROR}
            </h1>
            <h4 style={{ textAlign: "center" }}>
              {ReasonPhrases.INTERNAL_SERVER_ERROR}
            </h4>
            <p style={{ textAlign: "center" }}>
              <a href={HOME_ROUTE}>Home</a>
            </p>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="container">
        <div style={{ margin: "80px 0 80px 0" }}>{getErrorBody(status)}</div>
      </div>
    </div>
  );
};

export default ErrorPage;
