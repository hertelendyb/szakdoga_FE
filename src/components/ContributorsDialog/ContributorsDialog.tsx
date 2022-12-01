import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { Contributor } from "../CreateTaskDialog/CreateTaskDialog";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";

interface ContributorsDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  isForProject?: boolean;
}

export const ContributorsDialog = ({
  open,
  setOpen,
  isForProject = false,
}: ContributorsDialogProps) => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const { id, projectId } = useParams();

  useEffect(() => {
    const getContributors = async () => {
      if (!isForProject) {
        const res = await axios.get(`/api/organizations/${id}/list-users`);
        setContributors(res.data);
      } else {
        const res = await axios.get(
          `/api/organizations/${id}/projects/${projectId}/list-users`
        );
        setContributors(res.data);
      }
    };

    getContributors();
  }, [id, projectId, isForProject, open]);

  const handleClose = () => {
    setOpen(false);
  };

  const removeUser = async (userId: number) => {
    try {
      await axios({
        method: "delete",
        url: !isForProject
          ? `/api/organizations/${id}/remove-user`
          : `/api/organizations/${id}/projects/${projectId}/remove-user`,
        data: { id: userId },
      });
      setOpen(false);
      toast.success("User removed from organization successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Members</DialogTitle>
      <DialogContent>
        {contributors.length ? (
          <Grid rowGap={2} container>
            {contributors.map((contributor) => (
              <Grid
                sx={{
                  border: "1px solid black",
                  padding: 1,
                  alignItems: "center",
                  borderRadius: "5px",
                  minWidth: "20rem",
                }}
                key={contributor.id}
                container
              >
                <Grid item xs={7}>
                  <Typography>{contributor.user.name}</Typography>
                </Grid>
                <Grid item xs={5}>
                  <Button
                    onClick={() => removeUser(contributor.user.id)}
                    variant="contained"
                    color="error"
                    fullWidth
                  >
                    Remove user
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No members found</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
