import React from "react";

import wallet from "../../../../data/wallet.json";

const WalletSection = () => {
  return (
    <div>
      {wallet.map((wallet, index) => (
        <div
          key={index}
          className="single-schedule-area single-page d-flex flex-wrap justify-content-between align-items-center wow fadeInUp"
          data-wow-delay="300ms"
          style={{
            visibility: "visible",
            animationDelay: "300ms",
            animationName: "fadeInUp",
          }}
        >
          <div className="single-schedule-tumb-info d-flex align-items-center">
            {/* <div className="single-schedule-tumb"></div> */}
            <div className="single-schedule-info">
              <h6 style={{ textAlign: "left" }}>{wallet.countMessage}</h6>
              <p style={{ textAlign: "left" }}>
                <span>{wallet.message}</span>
              </p>
            </div>
          </div>

          <div className="schedule-time-place">
            <p>
              <i className="zmdi zmdi-time"></i>
              {wallet.timeMessage}
            </p>
            <br />
            <p>
              <i className="zmdi zmdi-map"></i>
              {wallet.featuresMessage}
            </p>
            <br />
            <p>
              <i className="zmdi zmdi-email"></i> {wallet.emailMessage}
            </p>
          </div>

          <a href="/" className="btn confer-btn">
            {wallet.priceMessage}
            <i className="zmdi zmdi-long-arrow-right"></i>
          </a>
        </div>
      ))}
    </div>
  );
};

export default WalletSection;
