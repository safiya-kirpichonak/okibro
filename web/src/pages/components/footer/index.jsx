import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Footer = () => {
  return (
    <footer className="footer-area bg-img bg-overlay-2 section-padding-100-0">
      <HelmetProvider>
        <Helmet>
          <script src="/theme/js/default-assets/active.js"></script>
        </Helmet>
      </HelmetProvider>
      <div className="main-footer-area">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="single-footer-widget mb-60">
                <h5 className="widget-title">What is Okibro used for?</h5>
                <p>
                  Okibro is an artificial intelligence tool that aids in
                  learning the English language through comprehensive online
                  lessons. Simply register, pay for a subscription, and start
                  practicing your conversational skills.
                </p>
                <div className="social-info">
                  <a href="/">
                    <i className="zmdi zmdi-facebook"></i>
                  </a>
                  <a href="https://twitter.com/okibro_com">
                    <i className="zmdi zmdi-twitter"></i>
                  </a>
                  <a href="https://www.linkedin.com/company/okibro/">
                    <i className="zmdi zmdi-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div
                className="single-footer-widget mb-60 wow fadeInUp"
                data-wow-delay="300ms"
              >
                <h5 className="widget-title">Contact us</h5>

                <div className="footer-contact-info">
                  <p>
                    <i className="zmdi zmdi-phone"></i> +370 670 41 408
                  </p>
                  <p>
                    <i className="zmdi zmdi-phone"></i> +995 599 14 89 74
                  </p>
                  <p>
                    <i className="zmdi zmdi-email"></i> daddy@okibro.com
                  </p>
                  <p>
                    <i className="zmdi zmdi-globe"></i> www.okibro.com
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div
                className="single-footer-widget mb-60 wow fadeInUp"
                data-wow-delay="300ms"
                style={{
                  visibility: "visible",
                  animationDelay: "300ms",
                  animationName: "fadeInUp",
                }}
              >
                <h5 className="widget-title">Solutions</h5>
                <ul id="solutions-nav" className="footer-nav">
                  <li
                    id="menu-item-97"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-97"
                  >
                    <a href="https://okibro.com/solutions/ai-english-speaking-app-okibro/">
                      AI English Speaking App: Okibro
                    </a>
                  </li>
                  <li
                    id="menu-item-98"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-98"
                  >
                    <a href="https://okibro.com/solutions/ai-english-speaking-partner/">
                      AI English Speaking Partner
                    </a>
                  </li>
                  <li
                    id="menu-item-99"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-99"
                  >
                    <a href="https://okibro.com/solutions/ai-english-tutor/">
                      AI English Tutor
                    </a>
                  </li>
                  <li
                    id="menu-item-100"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-100"
                  >
                    <a href="https://okibro.com/solutions/app-to-learn-english-okibro/">
                      App to Learn English: Okibro
                    </a>
                  </li>
                </ul>{" "}
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div
                className="single-footer-widget mb-60 wow fadeInUp"
                data-wow-delay="300ms"
                style={{
                  visibility: "visible",
                  animationDelay: "300ms",
                  animationName: "fadeInUp",
                }}
              >
                <h5 className="widget-title">Countries</h5>

                <ul id="countries-nav" className="footer-nav">
                  <li
                    id="menu-item-106"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-106"
                  >
                    <a href="https://okibro.com/countries/learn-english-in-australia/">
                      Learn English in Australia
                    </a>
                  </li>
                  <li
                    id="menu-item-107"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-107"
                  >
                    <a href="https://okibro.com/countries/learn-english-in-canada/">
                      Learn English in Canada
                    </a>
                  </li>
                  <li
                    id="menu-item-108"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-108"
                  >
                    <a href="https://okibro.com/countries/learn-english-in-china/">
                      Learn English in China
                    </a>
                  </li>
                  <li
                    id="menu-item-109"
                    className="menu-item menu-item-type-post_type menu-item-object-page menu-item-109"
                  >
                    <a href="https://okibro.com/countries/learn-english-in-germany/">
                      Learn English in Germany
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="copywrite-content">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="copywrite-text">
                <p>
                  Copyright ©
                  <script>document.write(new Date().getFullYear());</script>2023
                  All rights reserved | Okibro LTD
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="footer-menu">
                <ul className="nav">
                  <li>
                    <a href="https://okibro.com/terms-of-use/">
                      <i className="zmdi zmdi-circle"></i> Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="https://okibro.com/privacy-policy/">
                      <i className="zmdi zmdi-circle"></i> Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="https://okibro.com/sitemap_index.xml">
                      <i className="zmdi zmdi-circle"></i> Sitemap
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
