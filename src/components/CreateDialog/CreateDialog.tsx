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

interface CreateDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  isForProject?: boolean;
  orgId?: string;
}

export const CreateDialog = ({
  open,
  setOpen,
  isForProject = false,
  orgId,
}: CreateDialogProps) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateOrg = async () => {
    await axios({
      method: "post",
      url: "/api/organizations/create",
      data: {
        name,
      },
    });
    setOpen(false);
    navigate(0);
  };

  const handleCreateProject = async () => {
    await axios({
      method: "post",
      url: `/api/organizations/${orgId}/projects/create`,
      data: {
        name,
      },
    });
    setOpen(false);
    navigate(0);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Create new {isForProject ? "project" : "organization"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the name of the {isForProject ? "project" : "organization"}
        </DialogContentText>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={!isForProject ? handleCreateOrg : handleCreateProject}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
