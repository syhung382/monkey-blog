import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 16px;
    }
    &-title {
      margin-bottom: 8px;
    }
  }
`;

const PostItem = ({ data }) => {
  const [category, setCategory] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const catRef = doc(db, "categories", data.categoryId);
        const catSnapshot = await getDoc(catRef);
        if (catSnapshot) {
          setCategory(catSnapshot.data());
        }

        const userRef = doc(db, "users", data.userId);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot) {
          setUser(userSnapshot.id, ...userSnapshot.data());
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    fetchData();
  }, [data]);

  if (!data) return null;

  return (
    <PostItemStyles>
      <PostImage
        url="https://images.unsplash.com/photo-1570993492881-25240ce854f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2290&q=80"
        alt=""
        to={`/${data?.slug}`}
      />
      <PostCategory to={`/c/${category?.slug}`}>{category?.name}</PostCategory>
      <PostTitle to={`/${data?.slug}`}>{data?.title}</PostTitle>
      <PostMeta
        date={new Date(data?.createdAt?.seconds * 1000).toLocaleDateString(
          "vi-VI"
        )}
        author={user?.fullname}
        directTo={`/u/${data?.userId}`}
      ></PostMeta>
    </PostItemStyles>
  );
};

export default PostItem;
