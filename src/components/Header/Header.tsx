import { Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

import "./styles.css";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.get("api/users/logout");
    window.localStorage.setItem("auth", "false");
    navigate("/");
  };

  return (
    <div className="header">
      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};
