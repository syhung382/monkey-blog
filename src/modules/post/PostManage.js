import React, { useEffect, useState } from "react";
import { Table } from "../../components/table";
import { Pagination } from "../../components/pagination";
import DashboardHeading from "../dashboard/DashboardHeading";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { postStatus, queryLimit } from "../../utils/constants";
import { db } from "../../firebase-app/firebase-config";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import LabelStatus from "../../components/label/LabelStatus";
import { debounce } from "lodash";
import Button from "../../components/button/Button";

const PostManage = () => {
  const [filter, setFilter] = useState("");
  const [listPost, setListPost] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  const [total, setTotal] = useState(0);

  let qLimit = Number(queryLimit.NORMAL);

  const navigate = useNavigate();

  const handleDeletePost = async (docId) => {
    const colRef = doc(db, "posts", docId);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(colRef);
          toast.success("Delete post successfully!");
        } catch (e) {
          toast.error(e.message);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const renderPostStatus = (status) => {
    switch (status) {
      case postStatus.APPROVED:
        return <LabelStatus type="success">Approved</LabelStatus>;
      case postStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case postStatus.Re:
        return <LabelStatus type="danger">Rejected</LabelStatus>;
      default:
        return <LabelStatus type="danger">--</LabelStatus>;
    }
  };

  const handleSearchPost = debounce((e) => {
    setFilter(e.target.value);
  }, 250);

  const handleLoadMore = async () => {
    const nextRef = query(
      collection(db, "posts"),
      startAfter(lastDoc),
      limit(qLimit)
    );

    onSnapshot(nextRef, (snapshot) => {
      let results = [];

      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setListPost([...listPost, ...results]);
    });
  };

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");

      const newRef = filter
        ? query(
            colRef,
            where("title", ">=", filter),
            where("title", "<=", filter + "utf8"),
            limit(qLimit)
          )
        : query(colRef, limit(qLimit));

      const documentSnapshots = await getDocs(newRef);

      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      setLastDoc(lastVisible);

      onSnapshot(newRef, (snapshot) => {
        let results = [];

        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setListPost(results);
      });

      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });
    }
    fetchData();
  }, [filter]);

  return (
    <div>
      <DashboardHeading
        title="All posts"
        desc="Manage all posts"
      ></DashboardHeading>
      <div className="flex justify-end mb-10">
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 border-solid rounded-lg"
            placeholder="Search post..."
            onChange={handleSearchPost}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listPost.length > 0 &&
            listPost.map((post) => (
              <tr key={post.id}>
                <td title={post.id}>{post.id.slice(0, 5)}...</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
                      alt=""
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold whitespace-break-spaces">
                        {post.title}
                      </h3>
                      <time className="text-sm text-gray-500">
                        {new Date(
                          post?.createdAt?.seconds * 1000
                        ).toLocaleDateString("vi-VI")}
                      </time>
                    </div>
                  </div>
                </td>
                <td title={post.categoryId}>
                  <span className="text-gray-500">
                    {post.categoryId.slice(0, 5)}...
                  </span>
                </td>
                <td title={post.userId}>
                  <span className="text-gray-500">
                    {post.userId.slice(0, 5)}...
                  </span>
                </td>
                <td>{renderPostStatus(post.status)}</td>
                <td>
                  <div className="flex item-center gap-x-3">
                    <ActionView
                      onClick={() => navigate(`/${post.slug}`)}
                    ></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-post?id=${post.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeletePost(post.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > qLimit && total > listPost?.length && (
        <div className="mt-10">
          <Button onClick={handleLoadMore} className="mx-auto">
            Load more
          </Button>
        </div>
      )}
      {/* <div className="mt-10">
        <Pagination></Pagination>
      </div> */}
    </div>
  );
};

export default PostManage;
