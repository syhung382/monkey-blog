import React, { useEffect, useState } from "react";
import Heading from "../../components/layout/Heading";
import PostItem from "./PostItem";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { queryLimit } from "../../utils/constants";

const PostRelated = ({ categoryId = "" }) => {
  const [listPost, setListPost] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        if (!categoryId) return;
        const colRef = query(
          collection(db, "posts"),
          where("categoryId", "==", categoryId),
          limit(queryLimit.SMALL)
        );

        await onSnapshot(colRef, (snapshot) => {
          let results = [];

          snapshot.forEach((doc) => {
            results.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          setListPost(results);
        });
      } catch (e) {
        console.log(e.message);
      }
    }
    fetchData();
  }, [categoryId]);

  if (!categoryId || listPost.length <= 0) return;

  return (
    <div className="post-related">
      <Heading>Bài viết liên quan</Heading>
      <div className="grid-layout grid-layout--primary">
        {listPost.length > 0 &&
          listPost.map((item) => (
            <PostItem key={item.id} data={item}></PostItem>
          ))}
      </div>
    </div>
  );
};

export default PostRelated;
