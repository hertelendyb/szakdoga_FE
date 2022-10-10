import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-toastify";

import { setUser } from "../../store/slices/userSlice";
import { Dropzone } from "../Dropzone/Dropzone";
import { useAppDispatch } from "../../store/hooks";

import { Box, TextField, Button } from "@mui/material";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  username: yup.string().required("Name is required"),
});

export const SignUp = () => {
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await axios({
          method: "post",
          url: "/api/users/signup",
          data: {
            email: values.email,
            password: values.password,
            name: values.username,
            profilePicture: image,
          },
        });
        const res = await axios({
          method: "post",
          url: "/api/users/login",
          data: {
            email: values.email,
            password: values.password,
          },
        });
        navigate("/home");
        dispatch(setUser({ user: res.data }));
      } catch (e: any) {
        toast.error(e.response.data.message);
      }
    },
  });

  return (
    <Box
      sx={{
        backgroundColor: "darkblue",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            borderRadius: 3,
            p: 3,
            gap: 2,
          }}
        >
          <TextField
            label="Email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label="Password"
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            label="Username"
            type="username"
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <Dropzone image={image} setImage={setImage} />
          <Button variant="outlined" type="submit">
            Sign up
          </Button>
        </Box>
      </form>
    </Box>
  );
};
