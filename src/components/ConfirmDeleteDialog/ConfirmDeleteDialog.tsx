import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmDeleteDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  deleteProject?: boolean;
  deleteTask?: boolean;
  deleteComment?: boolean;
  orgId?: string;
  projectId?: string;
  taskId?: string;
  commentId?: number;
}

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
      try {
        await axios.delete(
          `https://lilh91-task-manager-be.herokuapp.com/api/organizations/${orgId}/projects/${projectId}`
        );
        setOpen(false);
        navigate(`/organization/${orgId}`);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    } else if (deleteTask) {
      try {
        await axios.delete(
          `https://lilh91-task-manager-be.herokuapp.com/api/organizations/${orgId}/projects/${projectId}/tasks/${taskId}`
        );
        setOpen(false);
        navigate(`/organization/${orgId}/project/${projectId}`);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    } else if (deleteComment) {
      try {
        await axios.delete(
          `https://lilh91-task-manager-be.herokuapp.com/api/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/delete-comment/${commentId}`
        );
        setOpen(false);
        navigate(0);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    } else {
      try {
        await axios.delete(
          `https://lilh91-task-manager-be.herokuapp.com/api/organizations/${orgId}`
        );
        setOpen(false);
        navigate("/home");
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
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
