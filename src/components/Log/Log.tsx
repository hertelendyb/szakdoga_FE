import React, { useEffect, useState } from "react";

import { formatDate } from "../../utils/formatDate";

import { Box, Typography } from "@mui/material";

type LogProps = {
  text: string;
  timestamp: string;
};

export const Log = ({ text, timestamp }: LogProps) => {
  const [formatedTime, setFormatedTime] = useState("");

  useEffect(() => {
    const time = formatDate(timestamp);
    setFormatedTime(time);
  }, [timestamp]);

  return (
    <Box
      sx={{
        borderBottom: "1px solid grey",
        p: 1,
      }}
    >
      <Typography variant="caption">{formatedTime}</Typography>
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
};
