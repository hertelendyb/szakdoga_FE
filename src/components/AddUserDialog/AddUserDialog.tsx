import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

type AddUserDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  orgId?: string;
  projectId?: string;
  addPO?: boolean;
  addToProject?: boolean;
};

export const AddUserDialog = ({
  open,
  setOpen,
  orgId,
  projectId,
  addPO = false,
  addToProject = false,
}: AddUserDialogProps) => {
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddUserToProject = async () => {
    try {
      await axios({
        method: "post",
        url: `https://lilh91-task-manager-be.herokuapp.com/api/organizations/${orgId}/projects/${projectId}/add-${
          addPO ? "project-owner" : "contributor"
        }`,
        data: {
          email,
        },
      });
      setOpen(false);
      toast.success("User added successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleAddUserToOrg = async () => {
    try {
      await axios({
        method: "post",
        url: `https://lilh91-task-manager-be.herokuapp.com/api/organizations/${orgId}/add-${
          addPO ? "project-owner" : "contributor"
        }`,
        data: {
          email,
        },
      });
      setOpen(false);
      toast.success("User added successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add user</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the email of the user</DialogContentText>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          margin="dense"
          id="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={addToProject ? handleAddUserToProject : handleAddUserToOrg}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
