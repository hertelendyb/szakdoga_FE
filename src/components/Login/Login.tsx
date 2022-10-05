import React, { useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import axios from "axios";

import { Box, Button, TextField } from "@mui/material";
import { setUser } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../store/hooks";

export const loginLoader = async () => {
  try {
    const res = await axios.get("/api/users/me");
    if (res.status === 200) {
      return redirect("/home");
    }
  } catch (err) {
    console.log(err);
  }
};

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      const res = await axios({
        method: "post",
        url: "/api/users/login",
        data: {
          email,
          password,
        },
      });
      navigate("/home");
      dispatch(setUser({ user: res.data }));
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "darkblue",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          width: "25%",
          height: "min-content",
          borderRadius: 3,
          p: 3,
          gap: 2,
        }}
      >
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleLogin}>
          Log in
        </Button>
        <Button component={Link} to="/signup" variant="outlined">
          Sign up
        </Button>
      </Box>
    </Box>
  );
};
