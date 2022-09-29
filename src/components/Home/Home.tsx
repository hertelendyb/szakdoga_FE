import { Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CreateDialog } from "../CreateDialog/CreateDialog";
import { ProjectCard } from "../ProjectCard/ProjectCard";

interface Organizations {
  id: number | null;
  name: string;
}

export const Home = () => {
  const [organizations, setOrganizations] = useState<[Organizations]>([
    {
      id: null,
      name: "No organization found",
    },
  ]);
  const [projects, setProjects] = useState<[Organizations]>([
    {
      id: null,
      name: "No project found",
    },
  ]);
  const [open, setOpen] = useState(false);

  const getOrgsAndProjects = async () => {
    const orgResponse: any = await axios.get("/api/organizations");
    if (orgResponse.data instanceof Array) {
      setOrganizations(orgResponse.data);
    }
    const projectResponse: any = await axios.get("/api/users/myProjects");
    if (projectResponse.data instanceof Array) {
      setProjects(projectResponse.data);
    }
  };

  useEffect(() => {
    getOrgsAndProjects();
    axios.get("/api/users/me");
  }, []);

  const openDialog = () => {
    setOpen(true);
  };

  return (
    <Box>
      <Typography sx={{ mb: 3 }}>Organizations</Typography>
      <Grid container spacing={5}>
        {organizations.map((organization) => (
          <Grid key={organization.id} item xs={3}>
            <Link to={`/organization/${organization.id}`}>
              <ProjectCard name={organization.name} />
            </Link>
          </Grid>
        ))}
        <Grid item xs={3}>
          <Button variant="contained" onClick={openDialog}>
            Create new organization
          </Button>
        </Grid>
      </Grid>
      <Typography sx={{ my: 3 }}>Projects</Typography>
      <Grid container spacing={5}>
        {projects.map((project) => (
          <Grid key={project.id} item xs={3}>
            <ProjectCard name={project.name} />
          </Grid>
        ))}
      </Grid>
      <CreateDialog open={open} setOpen={setOpen} />
    </Box>
  );
};
