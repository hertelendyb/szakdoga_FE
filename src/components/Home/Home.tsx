import { Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CreateDialog } from "../CreateDialog/CreateDialog";
import { ProjectCard } from "../ProjectCard/ProjectCard";

export const Home = () => {
  const [organizations, setOrganizations] = useState([
    {
      id: null,
      name: "",
    },
  ]);
  const [projects, setProjects] = useState([
    {
      id: null,
      name: "",
      organization: {
        id: null,
        name: "",
      },
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
      {!organizations[0].id ? (
        <Typography>No organizations found</Typography>
      ) : (
        <Grid container spacing={5}>
          {organizations.map((organization) => (
            <Grid key={organization.id} item xs={3}>
              <Link to={`/organization/${organization.id}`}>
                <ProjectCard name={organization.name} />
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
      <Typography sx={{ my: 3 }}>Projects</Typography>
      {!projects[0].id ? (
        <Typography>No projects found</Typography>
      ) : (
        <Grid container spacing={5}>
          {projects.map((project) => (
            <Grid key={project.id} item xs={3}>
              <Link
                to={`/organization/${project.organization.id}/project/${project.id}`}
              >
                <ProjectCard name={project.name} />
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
      <Button sx={{ mt: 3 }} variant="contained" onClick={openDialog}>
        Create new organization
      </Button>
      <CreateDialog open={open} setOpen={setOpen} getOrg={getOrgsAndProjects} />
    </Box>
  );
};
