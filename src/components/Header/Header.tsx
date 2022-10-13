import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { clearUser, selectUser } from "../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { Avatar, Box, Button, Typography } from "@mui/material";
import { styles } from "./styles";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await axios.get("/api/users/logout");
    dispatch(clearUser());
    navigate("/login");
  };

  const { user } = useAppSelector(selectUser);

  return (
    <Box sx={styles.header}>
      <Box sx={{ pl: 2 }}>
        <Link to="/home">
          <Typography variant="h5">Task manager</Typography>
        </Link>
      </Box>
      <Box sx={styles.userBox}>
        <Avatar
          alt={user.name}
          src={user.profilePicture ? user.profilePicture : undefined}
        />
        <Typography sx={{ ml: 2 }}>{user.name}</Typography>
        <Button sx={{ m: 2 }} variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};
