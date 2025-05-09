import React from "react";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

const PostCategoryStyle = styled.div`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 10px;
  color: ${(props) => props.theme.gray6B};
  font-size: 14px;
  font-weight: 600;
  a {
    display: block;
  }
  ${(props) =>
    props.type === "primary" &&
    css`
      background-color: ${(props) => props.theme.grayF3};
    `};
  ${(props) =>
    props.type === "secondary" &&
    css`
      background-color: #ffffff;
    `};
`;

const PostCategory = ({
  children,
  type = "primary",
  className = "",
  directTo = "#",
}) => {
  return (
    <PostCategoryStyle type={type} className={`post-category ${className}`}>
      <NavLink to={directTo}>{children}</NavLink>
    </PostCategoryStyle>
  );
};

export default PostCategory;
