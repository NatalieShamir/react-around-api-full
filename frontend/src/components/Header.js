import headerLogo from "../images/header.svg";
import React from "react";
import { Link, useLocation } from 'react-router-dom';

export default function Header({ isLoggedIn, email, onSignOut }) {

  const location = useLocation();

  return (
    <header className="header">
      <img
        className="header__image"
        src={headerLogo}
        alt="Project title- Around The U.S."
      />

      <div className="header__container">
        {isLoggedIn ? (
          <div className="header__container-items">
            <p className="header__email">{email}</p>
            <p className="header__text" onClick={onSignOut}>Log out</p>
          </div>
        ) : (
          <div>
            <Link to={location.pathname === "/signin" ? "/signup" : "/signin"} className="header__link">
              {location.pathname === "/signin" ? "Sign up" : "Log In"}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
