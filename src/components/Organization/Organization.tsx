import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog/ConfirmDeleteDialog";
import { CreateDialog } from "../CreateDialog/CreateDialog";
import { ProjectCard } from "../ProjectCard/ProjectCard";
import { AddUserDialog } from "../AddUserDialog/AddUserDialog";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/slices/userSlice";

import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Typography,
  Link as MUILink,
} from "@mui/material";
import { ContributorsDialog } from "../ContributorsDialog/ContributorsDialog";

export interface Project {
  id: number;
  name: string;
}

export const Organization = () => {
  const { id } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [contributorsOpen, setContributorsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isPO, setIsPO] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const orgName = useLoaderData();

  const { orgPermissions } = useAppSelector(selectUser);

  const getOrganization = useCallback(async () => {
    try {
      const res = await axios.get(`/api/organizations/${id}`);
      setProjects(res.data.projects);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [id]);

  useEffect(() => {
    const havePermission = orgPermissions.filter(
      (permission) =>
        permission.roleId === 1 &&
        permission.organizationId === parseInt(id as string, 10)
    );
    if (havePermission.length) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }

    getOrganization();
  }, [getOrganization, id]);

  const openCreateDialog = () => {
    setCreateOpen(true);
  };

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  const openAddContributorDialog = () => {
    setIsPO(false);
    setAddOpen(true);
  };

  const openAddProjectOwnerDialog = () => {
    setIsPO(true);
    setAddOpen(true);
  };

  const openContributorsDialog = () => {
    setContributorsOpen(true);
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <MUILink underline="hover" color="inherit" component={Link} to="/home">
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
      {isOwner ? (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 3 }}>
          <Button variant="contained" onClick={openCreateDialog}>
            Create new project
          </Button>
          <Button variant="contained" color="error" onClick={openDeleteDialog}>
            Delete organization
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={openAddContributorDialog}
          >
            Add contributor to this organization
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={openAddProjectOwnerDialog}
          >
            Add PO to this organization
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={openContributorsDialog}
          >
            Show organization members
          </Button>
        </Box>
      ) : null}
      <CreateDialog
        open={createOpen}
        setOpen={setCreateOpen}
        isForProject
        orgId={id}
        getProject={getOrganization}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        orgId={id}
      />
      <AddUserDialog
        open={addOpen}
        setOpen={setAddOpen}
        orgId={id}
        addPO={isPO}
      />
      <ContributorsDialog
        open={contributorsOpen}
        setOpen={setContributorsOpen}
      />
    </Box>
  );
};
