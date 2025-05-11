import React, { useEffect } from "react";
import Label from "../components/label/Label";
import Input from "../components/input/Input";

import { useForm } from "react-hook-form";
import { Field } from "../components/field";
import Button from "../components/button/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase-app/firebase-config";
import { NavLink, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import AuthenticationPage from "./AuthenticationPage";
import Layout from "../components/layout/Layout";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
import slugify from "slugify";
import { userRole, userStatus } from "../utils/constants";

const schema = yup.object({
  fullname: yup.string().required("Please enter your fullname!"),
  email: yup
    .string()
    .email("Please enter valid email address!")
    .required("Please enter your email address!"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater!")
    .required("Please enter your password"),
});

const SignUpPage = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleSignUp = async (values) => {
    if (!isValid) return;

    await createUserWithEmailAndPassword(auth, values.email, values.password);

    await updateProfile(auth.currentUser, {
      displayName: values.fullname,
    });

    await setDoc(doc(db, "users", auth.currentUser.uid), {
      fullname: values.fullname,
      email: values.email,
      password: values.password,
      username: slugify(values.fullname, { lower: true }),
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createdAt: serverTimestamp(),
    });

    toast.success("Register successfully!");
    navigate("/");
  };

  useEffect(() => {
    document.title = "Monkey Bloggin | Sign Up page";
    const arrErrors = Object.values(errors);

    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message, { pauseOnHover: false, delay: 0 });
    }
  }, [errors]);

  return (
    <Layout>
      <AuthenticationPage>
        <form
          className="form"
          onSubmit={handleSubmit(handleSignUp)}
          autoComplete="off"
        >
          <Field>
            <Label htmlFor="fullname" className="label">
              FullName
            </Label>
            <Input
              type="text"
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
              maxLength="250"
            ></Input>
          </Field>
          <Field>
            <Label htmlFor="email" className="label">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email address"
              control={control}
              maxLength="250"
            ></Input>
          </Field>
          <Field>
            <Label htmlFor="password" className="label">
              Password
            </Label>
            <InputPasswordToggle control={control}></InputPasswordToggle>
          </Field>
          <div className="have-account">
            You already have an account?{" "}
            <NavLink to={"/sign-in"}>Login</NavLink>
          </div>
          <Field>
            <Button
              type="submit"
              style={{
                maxWidth: 300,
                margin: "0 auto",
                width: "100%",
              }}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
          </Field>
        </form>
      </AuthenticationPage>
    </Layout>
  );
};

export default SignUpPage;
