import { Box, Typography } from "@mui/material";
import React from "react";

export const NotFound = ({ type }: { type: string }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h2">{`${type} not found`}</Typography>
    </Box>
  );
};
