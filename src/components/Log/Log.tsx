import React from "react";
import { format, parseJSON } from "date-fns";

import { Box, Typography } from "@mui/material";

type LogProps = {
  text: string;
  timestamp: string;
};

export const Log = ({ text, timestamp }: LogProps) => {
  const parsedTime = parseJSON(timestamp);
  const formattedTime = format(parsedTime, "yyyy-MM-dd HH:mm:ss");

  return (
    <Box
      sx={{
        borderBottom: "1px solid grey",
        p: 1,
      }}
    >
      <Typography variant="caption">{formattedTime}</Typography>
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
};
