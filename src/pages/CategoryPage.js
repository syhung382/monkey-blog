import {
  collection,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase-app/firebase-config";
import Heading from "../components/layout/Heading";
import PostItem from "../modules/post/PostItem";

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState({});
  const [colPost, setColPost] = useState({});

  useEffect(() => {
    async function fetchData() {
      const catRef = query(
        collection(db, "categories"),
        where("slug", "==", slug)
      );
      await onSnapshot(catRef, async (snapshot) => {
        let results = [];

        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCategory(results);

        // console.log(results[0]);
        const postRef = query(
          collection(db, "posts"),
          where("categoryId", "==", results[0].id)
        );
        await onSnapshot(postRef, (snapshot) => {
          let resulsts2 = [];
          snapshot.forEach((doc2) => {
            resulsts2.push({
              id: doc2.id,
              ...doc2.data(),
            });
          });

          setColPost(resulsts2);
        });
      });
    }
    fetchData();
  }, [slug]);

  if (!slug) return;

  return (
    <div className="container">
      <div className="pt-20"></div>
      <Heading>Danh mục {category[0]?.name}</Heading>
      <div className="grid-layout grid-layout--primary">
        {colPost.length > 0 &&
          colPost.map((item) => (
            <PostItem key={item.id} data={item}></PostItem>
          ))}
      </div>
    </div>
  );
};

export default CategoryPage;
