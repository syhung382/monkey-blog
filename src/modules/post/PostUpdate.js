import React, { useState } from "react";
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

const PostUpdate = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState([]);

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

  const updatePostHandle = (values) => {};

  const handleSelectOption = (item) => {
    setValue("categoryId", item.id);
    setSelectedCategorie(item);
  };

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
            Add new post
          </Button>
        </div>
      </form>
    </>
  );
};

export default PostUpdate;
