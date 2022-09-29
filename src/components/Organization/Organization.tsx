import { Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateDialog } from "../CreateDialog/CreateDialog";
import { ProjectCard } from "../ProjectCard/ProjectCard";

export const Organization = () => {
  const { id } = useParams();
  const [projects, setProjects] = useState([{ id: null, name: "" }]);
  const [open, setOpen] = useState(false);

  const getOrganization = async () => {
    try {
      const res = await axios.get(`/api/organizations/${id}`);
      setProjects(res.data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrganization();
  }, []);

  const openDialog = () => {
    setOpen(true);
  };

  return (
    <Box>
      <Typography sx={{ my: 3 }}>Projects</Typography>
      <Grid container spacing={5}>
        {projects.map((project) => (
          <Grid key={project.id} item xs={3}>
            <ProjectCard name={project.name} />
          </Grid>
        ))}
        <Grid item xs={3}>
          <Button variant="contained" onClick={openDialog}>
            Create new project
          </Button>
        </Grid>
      </Grid>
      <CreateDialog open={open} setOpen={setOpen} isForProject orgId={id} />
    </Box>
  );
};
