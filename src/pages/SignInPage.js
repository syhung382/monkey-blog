import React, { useEffect } from "react";
import { Field } from "../components/field";
import Label from "../components/label/Label";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/auth-context";
import { NavLink, useNavigate } from "react-router-dom";
import AuthenticationPage from "./AuthenticationPage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-app/firebase-config";
import Layout from "../components/layout/Layout";
import InputPasswordToggle from "../components/input/InputPasswordToggle";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address!")
    .required("Please enter your email address!"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater!")
    .required("Please enter your password"),
});

const SignInPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Monkey Bloggin | Sign In page";
    if (userInfo?.email) navigate("/");
  }, [userInfo]);

  const handleSignIn = async (values) => {
    if (!isValid) return;
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);

      toast.success("Sign In successfully!");
      navigate("/");
    } catch (e) {
      toast.error("error");
      console.log(e);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
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
          autoComplete="off"
          onSubmit={handleSubmit(handleSignIn)}
        >
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
            You have not had an account?{" "}
            <NavLink to={"/sign-up"}>Register an account</NavLink>
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
              Sign Up
            </Button>
          </Field>
        </form>
      </AuthenticationPage>
    </Layout>
  );
};

export default SignInPage;
