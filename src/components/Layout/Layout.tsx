import React from "react";
import axios from "axios";
import { Outlet, redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Header } from "../Header/Header";
import { store } from "../../store/store";
import { setUser } from "../../store/slices/userSlice";

import { Box } from "@mui/material";

import "react-toastify/dist/ReactToastify.css";

export const layoutLoader = async () => {
  try {
    const res = await axios.get("/api/users/me");
    store.dispatch(setUser(res.data));
  } catch (err: any) {
    if (err.response.status === 401) {
      return redirect("/login");
    }
  }
};

export const Layout = () => {
  return (
    <>
      {/* <ToastContainer /> */}
      <Header />
      <Box sx={{ p: 2, height: "100%", backgroundColor: "#f0f0f0" }}>
        <Outlet />
      </Box>
    </>
  );
};
