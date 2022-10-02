import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type ConfirmDeleteDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  isForProject?: boolean;
  orgId?: string;
  projectId?: number | null;
};

export const ConfirmDeleteDialog = ({
  open,
  setOpen,
  isForProject = false,
  orgId,
  projectId,
}: ConfirmDeleteDialogProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteOrg = async () => {
    await axios.delete(`/api/organizations/${orgId}`);
    setOpen(false);
    navigate("/home");
  };

  const handleDeleteProject = async () => {
    await axios.delete(`/api/organizations/${orgId}/projects/${projectId}`);
    setOpen(false);
    navigate("/home");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Delete {isForProject ? "project" : "organization"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this{" "}
          {isForProject ? "project" : "organization"}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={!isForProject ? handleDeleteOrg : handleDeleteProject}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
