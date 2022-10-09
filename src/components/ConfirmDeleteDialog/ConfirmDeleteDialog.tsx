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
  deleteProject?: boolean;
  deleteTask?: boolean;
  deleteComment?: boolean;
  orgId?: string;
  projectId?: string;
  taskId?: string;
  commentId?: number;
};

export const ConfirmDeleteDialog = ({
  open,
  setOpen,
  deleteProject = false,
  deleteTask = false,
  deleteComment = false,
  orgId,
  projectId,
  taskId,
  commentId,
}: ConfirmDeleteDialogProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    if (deleteProject) {
      await axios.delete(`/api/organizations/${orgId}/projects/${projectId}`);
      setOpen(false);
      navigate(`/organization/${orgId}`);
    } else if (deleteTask) {
      await axios.delete(
        `/api/organizations/${orgId}/projects/${projectId}/tasks/${taskId}`
      );
      setOpen(false);
      navigate(`/organization/${orgId}/project/${projectId}`);
    } else if (deleteComment) {
      await axios.delete(
        `/api/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/delete-comment/${commentId}`
      );
      setOpen(false);
      navigate(0);
    } else {
      await axios.delete(`/api/organizations/${orgId}`);
      setOpen(false);
      navigate("/home");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};
