import React, { useEffect, useState } from "react";

import { formatDate } from "../../utils/formatDate";

import { Box, Typography } from "@mui/material";
import { styles } from "./styles";

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
    <Box sx={styles.log}>
      <Typography variant="caption">{formatedTime}</Typography>
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
};
