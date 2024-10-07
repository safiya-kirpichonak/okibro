/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import "./style.css";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  PROMPTS_ROUTE,
  REPORT_ROUTE,
  ROLES_ROUTE,
  USERS_ROUTE,
  WALLET_ROUTE,
} from "../../../routes/const.js";
import MainButton from "../main-button/index.jsx";
import AuthService from "../../../services/AuthService.js";

const NavBar = ({ role }) => {
  const onClickLogOut = async () => {
    await AuthService.logout();
    window.location.href = LOGIN_ROUTE;
  };

  const onClickLogIn = async () => {
    window.location.href = LOGIN_ROUTE;
  };

  const roles = {
    admin: (
      <header className="header-area">
        <div className="classy-nav-container breakpoint-on">
          <div className="container">
            <nav
              className="classy-navbar d-flex justify-content-between"
              id="conferNav"
            >
              <a className="logo-a-color" href={HOME_ROUTE}>
                OK!BRO
              </a>
              <div className="classy-navbar-toggler">
                <span className="navbarToggler">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
              <div className="classy-menu">
                <div className="classycloseIcon">
                  <div className="cross-wrap">
                    <span className="top"></span>
                    <span className="bottom"></span>
                  </div>
                </div>
                <div className="classynav">
                  <ul id="nav">
                    <li>
                      <a href={ROLES_ROUTE}>Roles</a>
                    </li>
                    <li>
                      <a href={REPORT_ROUTE}>Reports</a>
                    </li>
                    <li>
                      {" "}
                      <a href={USERS_ROUTE}>Users</a>
                    </li>
                    <li>
                      {" "}
                      <a href={PROMPTS_ROUTE}>Prompts</a>
                    </li>
                    <li>
                      <a id="logout-link" onClick={onClickLogOut}>
                        LOG OUT
                        <i className="zmdi zmdi-accounts"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    ),
    student: (
      <header className="header-area">
        <div className="classy-nav-container breakpoint-on">
          <div className="container">
            <nav
              className="classy-navbar d-flex justify-content-between"
              id="conferNav"
            >
              <a className="logo-a-color" href={HOME_ROUTE}>
                OK!BRO
              </a>
              <div className="classy-navbar-toggler">
                <span className="navbarToggler">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
              <div className="classy-menu">
                <div className="classycloseIcon">
                  <div className="cross-wrap">
                    <span className="top"></span>
                    <span className="bottom"></span>
                  </div>
                </div>
                <div className="classynav">
                  <ul id="nav">
                    <li>
                      <a href={HOME_ROUTE}>Home</a>
                    </li>
                    <li>
                      <a href={PROFILE_ROUTE}>Profile</a>
                    </li>
                    {/* <li>
                      <a href={WALLET_ROUTE}>Wallet</a>
                    </li> */}
                    <li>
                      <a id="logout-link" onClick={onClickLogOut}>
                        LOG OUT
                        <i className="zmdi zmdi-accounts"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    ),
    default: (
      <header className="header-area">
        <div className="classy-nav-container breakpoint-on">
          <div className="container">
            <nav
              className="classy-navbar d-flex justify-content-between"
              id="conferNav"
            >
              <a className="logo-a-color" href={HOME_ROUTE}>
                OK!BRO
              </a>
              <MainButton text="LOG IN" onClick={onClickLogIn} />
            </nav>
          </div>
        </div>
      </header>
    ),
  };

  return <div>{roles[role] || roles.default}</div>;
};

export default NavBar;
