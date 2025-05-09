import React from "react";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

const PostTitleStyle = styled.h3`
  font-weight: 600;
  line-height: 1.5;
  a {
    display: block;
  }
  ${(props) =>
    props.size === "normal" &&
    css`
      font-size: 18px;
    `};
  ${(props) =>
    props.size === "large" &&
    css`
      font-size: 22px;
    `};
`;

const PostTitle = ({
  children,
  className = "",
  size = "normal",
  directTo = "#",
}) => {
  return (
    <PostTitleStyle size={size} className={`post-title ${className}`}>
      <NavLink to={directTo}>{children}</NavLink>
    </PostTitleStyle>
  );
};

export default PostTitle;
