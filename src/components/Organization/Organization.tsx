import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLoaderData, useParams } from "react-router-dom";

import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog/ConfirmDeleteDialog";
import { CreateDialog } from "../CreateDialog/CreateDialog";
import { ProjectCard } from "../ProjectCard/ProjectCard";

import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Typography,
  Link as MUILink,
} from "@mui/material";

export const Organization = () => {
  const { id } = useParams();
  const [projects, setProjects] = useState([{ id: null, name: "" }]);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const orgName = useLoaderData();

  useEffect(() => {
    const getOrganization = async () => {
      try {
        const res = await axios.get(`/api/organizations/${id}`);
        setProjects(res.data.projects);
      } catch (error) {
        console.log(error);
      }
    };

    getOrganization();
  }, [id]);

  const openCreateDialog = () => {
    setCreateOpen(true);
  };

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <MUILink underline="hover" color="inherit" href="/home">
          Home
        </MUILink>
        <Typography color="text.primary">{orgName as string}</Typography>
      </Breadcrumbs>
      <Typography variant="h5">{orgName as string}</Typography>
      <Typography sx={{ my: 3 }}>Projects</Typography>
      {projects.length === 0 ? (
        <Typography>No projects found</Typography>
      ) : (
        <Grid container spacing={5}>
          {projects.map((project) => (
            <Grid key={project.id} item xs={3}>
              <Link to={`/organization/${id}/project/${project.id}`}>
                <ProjectCard name={project.name} />
              </Link>
            </Grid>
          ))}
          <Grid item xs={3}></Grid>
        </Grid>
      )}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 3 }}>
        <Button variant="contained" onClick={openCreateDialog}>
          Create new project
        </Button>
        <Button variant="contained" color="error" onClick={openDeleteDialog}>
          Delete organization
        </Button>
      </Box>
      <CreateDialog
        open={createOpen}
        setOpen={setCreateOpen}
        isForProject
        orgId={id}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        orgId={id}
      />
    </Box>
  );
};
