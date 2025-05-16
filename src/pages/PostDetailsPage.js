import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Layout from "../components/layout/Layout";
import PostImage from "../modules/post/PostImage";
import PostCategory from "../modules/post/PostCategory";
import PostMeta from "../modules/post/PostMeta";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase-app/firebase-config";
import parse from "html-react-parser";
import NotFoundPage from "./NotFoundPage";
import PostRelated from "../modules/post/PostRelated";

const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const { slug } = useParams();
  const [postInfo, setPostInfo] = useState({});
  const [category, setCategory] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;

      try {
        const colRef = query(
          collection(db, "posts"),
          where("slug", "==", slug)
        );
        await onSnapshot(colRef, (snapshot) => {
          snapshot.forEach(async (docData) => {
            if (docData.data()) {
              setPostInfo(docData.data());

              const catRef = doc(db, "categories", docData.data().categoryId);
              const catSnapshot = await getDoc(catRef);
              if (catSnapshot) {
                setCategory(catSnapshot.data());
              }
              const userRef = doc(db, "users", docData.data().userId);
              const userSnapshot = await getDoc(userRef);
              if (userSnapshot) {
                setUser(userSnapshot.data());
              }
            }
          });
        });
      } catch (e) {
        console.log(e.message);
      }
    }
    fetchData();
  }, [slug]);

  useEffect(() => {
    // window.scroll(0, 0);
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slug]);

  if (!slug || !postInfo.title) return <NotFoundPage></NotFoundPage>;

  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage
              url="https://images.unsplash.com/photo-1649837867356-6c7ef7057f32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              className="post-feature"
            ></PostImage>
            <div className="post-info">
              <PostCategory className="mb-6" to={`/c/${category?.slug}`}>
                {category?.name}
              </PostCategory>
              <h1 className="post-heading">{postInfo?.title}</h1>
              <PostMeta
                date={new Date(
                  postInfo?.createdAt?.seconds * 1000
                ).toLocaleDateString("vi-VI")}
                author={user?.fullname}
                directTo={`/u/${user.id}`}
              ></PostMeta>
            </div>
          </div>
          <div className="post-content">
            <div className="entry-content">
              {postInfo?.content && parse(postInfo.content)}
            </div>
            <div className="author">
              <div className="author-image">
                <img
                  src="https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                  alt=""
                />
              </div>
              <div className="author-content">
                <h3 className="author-name">{user?.fullname}</h3>
                <p className="author-desc">{user?.description}</p>
              </div>
            </div>
          </div>
          <PostRelated categoryId={postInfo?.categoryId}></PostRelated>
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
