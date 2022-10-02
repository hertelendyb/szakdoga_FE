import axios from "axios";
import React, { useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog/ConfirmDeleteDialog";
import { CreateDialog } from "../CreateDialog/CreateDialog";
import { ProjectCard } from "../ProjectCard/ProjectCard";

import {
  Box,
  Typography,
  Grid,
  Button,
  Breadcrumbs,
  Link as MUILink,
} from "@mui/material";

export const Project = () => {
  const projectName = useLoaderData();
  const { id, projectId } = useParams();
  const [tasks, setTasks] = useState([{ id: null, name: "" }]);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const getOrganization = async () => {
      try {
        const res = await axios.get(
          `/api/organizations/${id}/projects/${projectId}/tasks`
        );
        const tasks = sortBy(res.data, ["order"]);
        setTasks(tasks);
      } catch (error) {
        console.log(error);
      }
    };

    getOrganization();
  }, [id, projectId]);

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
        <MUILink underline="hover" color="inherit" href={`/organization/${id}`}>
          parentorg
        </MUILink>
        <Typography color="text.primary">{projectName as string}</Typography>
      </Breadcrumbs>
      <Typography variant="h5">{projectName as string}</Typography>
      <ul>
        {tasks.map((task) => (
          <li>{task.name}</li>
        ))}
      </ul>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 3 }}>
        <Button variant="contained" onClick={openCreateDialog}>
          Create new task
        </Button>
        <Button variant="contained" color="error" onClick={openDeleteDialog}>
          Delete project
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
