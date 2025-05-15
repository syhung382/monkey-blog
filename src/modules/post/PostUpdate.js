import React, { useEffect, useMemo, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import { postStatus } from "../../utils/constants";
import { useForm } from "react-hook-form";
import { Field, FieldCheckboxes } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import ImageUpload from "../../components/image/ImageUpload";
import { Dropdown } from "../../components/dropdown";
import Toggle from "../../components/toggle/Toggle";
import { Radio } from "../../components/checkbox";
import { Button } from "../../components/button";
import { useSearchParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const PostUpdate = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState([]);
  const [content, setContent] = useState("");

  const [params] = useSearchParams();
  const postId = params.get("id");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValue,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: postStatus.PENDING,
      categoryId: "",
      hot: false,
      image: "",
    },
  });

  const watchStatus = watch("status");
  const watchHot = watch("hot");

  const updatePostHandle = async (values) => {
    if (!isValid) return;

    try {
      const docRef = doc(db, "posts", postId);
      await updateDoc(docRef, {
        ...values,
        content,
      });
      toast.success("Update post successfully!");
    } catch (e) {
      toast.error("Update post failed!");
      console.log(e.message);
    }
  };

  const handleSelectOption = (item) => {
    setValue("categoryId", item.id);
    setSelectedCategorie(item);
  };

  const modul = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
    }),
    []
  );

  useEffect(() => {
    async function fetchData() {
      if (!postId) return;

      const docRef = doc(db, "posts", postId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.data()) {
        reset({
          title: docSnapshot.data().title,
          slug: docSnapshot.data().slug,
          status: Number(docSnapshot.data().status),
          categoryId: docSnapshot.data().categoryId,
          hot: docSnapshot.data().hot,
          image: "",
        });

        setContent(docSnapshot.data()?.content || "");

        const catRef = doc(db, "categories", docSnapshot.data().categoryId);
        const catSnapshot = await getDoc(catRef);

        if (catSnapshot.data()) {
          setSelectedCategorie(catSnapshot.data());
          // console.log(catSnapshot.data());
        }
      }
    }

    async function getCategories() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setCategories(result);
    }

    getCategories();
    fetchData();
  }, [postId, reset]);

  if (!postId) return null;

  return (
    <>
      <DashboardHeading
        title="Update post"
        desc="Update post"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(updatePostHandle)}>
        <div className="grid grid-cols-2 mb-10 gap-x-10">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>
        <div className="grid grid-cols-2 mb-10 gap-x-10">
          <Field>
            <label>Image</label>
            <ImageUpload></ImageUpload>
          </Field>

          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select
                placeholder={`${
                  selectedCategorie?.name || "Please select the category"
                }`}
              ></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      key={item.id}
                      onClick={() => handleSelectOption(item)}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
          </Field>
          <Field></Field>
        </div>
        <div className="mb-10">
          <Field>
            <Label>Content</Label>
            <div className="w-full entry-content">
              <ReactQuill
                modules={modul}
                theme="snow"
                value={content}
                onChange={setContent}
              />
            </div>
          </Field>
        </div>
        <div className="grid grid-cols-2 mb-10 gap-x-10">
          <Field>
            <Label>Feature post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => {
                setValue("hot", !watchHot);
              }}
            ></Toggle>
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <div className="grid grid-cols-1 mb-10 gap-x-10">
          <Button
            type="submit"
            className="mx-auto w-[250px]"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Update post
          </Button>
        </div>
      </form>
    </>
  );
};

export default PostUpdate;
