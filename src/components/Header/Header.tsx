import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

import "./styles.css";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/slices/userSlice";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await axios.get("api/users/logout");
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className="header">
      <Button sx={{ m: 2 }} variant="contained" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};
