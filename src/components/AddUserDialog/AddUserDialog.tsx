import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type AddUserDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  orgId?: string;
  projectId?: string;
  addPO?: boolean;
};

export const AddUserDialog = ({
  open,
  setOpen,
  orgId,
  projectId,
  addPO = false,
}: AddUserDialogProps) => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddUserToProject = async () => {
    try {
      await axios({
        method: "post",
        url: `/api/organizations/${orgId}/projects/${projectId}/add-${
          addPO ? "project-owner" : "contributor"
        }`,
        data: {
          email,
        },
      });
      setOpen(false);
      navigate(0);
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  const handleAddUserToOrg = async () => {
    try {
      await axios({
        method: "post",
        url: `/api/organizations/${orgId}/add-${
          addPO ? "project-owner" : "contributor"
        }`,
        data: {
          email,
        },
      });
      setOpen(false);
      navigate(0);
    } catch (error: any) {
      console.log(error.response.data.message);
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
        <Button onClick={handleAddUserToProject}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};
