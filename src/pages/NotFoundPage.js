import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Layout from "../components/layout/Layout";

const NotFoundPageStyle = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .logo {
    display: inline-block;
    margin-bottom: 40px;
    max-width: 100px;
  }
  .heading {
    font-size: 60px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .back {
    display: inline-block;
    padding: 15px 30px;
    color: white;
    background-color: ${(props) => props.theme.primary};
    border-radius: 6px;
    font-weight: 500;
  }
`;

const NotFoundPage = () => {
  useEffect(() => {
    document.title = "Monkey Bloggin | 404 Not Found!";
  }, []);
  return (
    <Layout>
      <NotFoundPageStyle>
        <NavLink to="/">
          <img src="/logo.png" alt="Monkey Bloggin" className="logo" />
        </NavLink>
        <h1 className="heading">Oops! Page not found.</h1>
        <NavLink to="/" className={"back"}>
          Back to home
        </NavLink>
      </NotFoundPageStyle>
    </Layout>
  );
};

export default NotFoundPage;
