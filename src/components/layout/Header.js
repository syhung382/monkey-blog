import React from "react";
import styled from "styled-components";
import Button from "../button/Button";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-app/firebase-config";

const menuLinks = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/blog",
    title: "Blog",
  },
  {
    url: "/contact",
    title: "Contact",
  },
];

const HeaderStyle = styled.div`
  padding: 40px 0;
  .header-main {
    display: flex;
    align-items: center;
  }
  .logo {
    display: block;
    max-width: 50px;
  }
  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 40px;
    list-style: none;
    font-weight: 500;
  }
  .header-button {
    margin-left: 20px;
  }
  .btn-signout {
    margin-left: 5px;
  }
`;

function getLastName(name) {
  if (!name) return "";
  const length = name.split(" ").length;

  return name.split(" ")[length - 1];
}

const Header = () => {
  const { userInfo } = useAuth();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <HeaderStyle>
      <div className="container">
        <div className="header-main">
          <NavLink to="/">
            <img srcSet="./logo.png" alt="Monkey bloggin" className="logo" />
          </NavLink>
          <ul className="menu">
            {menuLinks.map((item) => (
              <li key={item.title} className="menu-item">
                <NavLink to={item.url} className="menu-link">
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex-1"></div>
          {!userInfo ? (
            <Button
              height="56px"
              className="header-button"
              type="button"
              to="/sign-in"
            >
              Sign Up
            </Button>
          ) : (
            <div className="header-auth">
              <span>Welcome back, </span>
              <strong className="text-primary">
                {getLastName(userInfo?.displayName)}
              </strong>
              <button className="btn-signout" onClick={handleSignOut}>
                SignOut
              </button>
            </div>
          )}
        </div>
      </div>
    </HeaderStyle>
  );
};

export default Header;
