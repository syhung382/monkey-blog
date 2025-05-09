import { signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { auth } from "../firebase-app/firebase-config";
import styled from "styled-components";
import Header from "../components/layout/Header";
import HomeBanner from "../modules/home/HomeBanner";
import Layout from "../components/layout/Layout";
import HomeFeature from "../modules/home/HomeFeature";
import HomeNewest from "../modules/home/HomeNewest";

const HomePageStyle = styled.div``;

const HomePage = () => {
  useEffect(() => {
    document.title = "Monkey Bloggin | Home";
  }, []);
  return (
    <HomePageStyle>
      <Layout>
        <HomeBanner></HomeBanner>
        <HomeFeature></HomeFeature>
        <HomeNewest></HomeNewest>
      </Layout>
    </HomePageStyle>
  );
};

export default HomePage;
