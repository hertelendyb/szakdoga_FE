import React from "react";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

interface CreateDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  isForProject?: boolean;
  orgId?: string;
  getOrg?: () => void;
  getProject?: () => void;
}

export const CreateDialog = ({
  open,
  setOpen,
  isForProject = false,
  orgId,
  getOrg = () => null,
  getProject = () => null,
}: CreateDialogProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .required("Name is required")
      .max(50, "Max 50 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    enableReinitialize: true,

    validationSchema: validationSchema,
    onSubmit: async ({ name }) => {
      try {
        isForProject
          ? await axios({
              method: "post",
              url: `/api/organizations/${orgId}/projects/create`,
              data: {
                name,
              },
            })
          : await axios({
              method: "post",
              url: "/api/organizations/create",
              data: {
                name,
              },
            });
        formik.resetForm();
        setOpen(false);
        isForProject ? getProject() : getOrg();
      } catch (e: any) {
        toast.error(e.response.data.message);
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Create new {isForProject ? "project" : "organization"}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Enter the name of the {isForProject ? "project" : "organization"}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            label="Name"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
