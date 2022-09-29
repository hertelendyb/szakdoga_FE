import React from "react";
import axios from "axios";
import { Outlet, redirect } from "react-router-dom";
import { Header } from "../Header/Header";

export const layoutLoader = async () => {
  try {
    await axios.get("api/users/me");
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
      <div>
        <Outlet />
      </div>
    </>
  );
};
