import React from "react";
import axios from "axios";
import { Outlet, redirect } from "react-router-dom";

import { Header } from "../Header/Header";
import { store } from "../../store/store";
import { setUser } from "../../store/slices/userSlice";

import { Box } from "@mui/material";

export const layoutLoader = async () => {
  try {
    const res = await axios.get(
      "https://lilh91-task-manager-be.herokuapp.com/api/users/me"
    );
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
      <Header />
      <Box sx={{ p: 2, height: "100%", backgroundColor: "#f0f0f0" }}>
        <Outlet />
      </Box>
    </>
  );
};
