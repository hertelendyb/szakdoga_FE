import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

import "./styles.css";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.get("api/users/logout");
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
