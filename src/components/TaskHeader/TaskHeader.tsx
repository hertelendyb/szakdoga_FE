import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { styles } from "./styles";

export const TaskHeader = () => {
  return (
    <Box sx={styles.taskHeader}>
      <Grid sx={{ ml: 9 }} container>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: "large" }}>Name</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: "large" }}>Assignee</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: "large" }}>Deadline</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontSize: "large" }}>Subtasks</Typography>
        </Grid>
      </Grid>
      <Typography sx={{ pr: 2, fontSize: "large" }}>Done</Typography>
    </Box>
  );
};
