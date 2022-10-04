import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

type CreateTaskDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  length: number;
  orgId?: string;
};

type Contributor = {
  id: number;
  projectId: number;
  roleId: number;
  user: {
    name: string;
  };
  userId: number;
};

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  deadline: yup.string().nullable(),
  assigneeId: yup.number(),
});

export const CreateTaskDialog = ({
  open,
  setOpen,
  length,
}: CreateTaskDialogProps) => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const navigate = useNavigate();
  const { id, projectId } = useParams();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      deadline: null,
      assigneeId: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await axios({
          method: "post",
          url: `/api/organizations/${id}/projects/${projectId}/tasks`,
          data: {
            name: values.name,
            description: values.description,
            ...(values.deadline ? { deadline: values.deadline } : {}),
            assigneeId: values.assigneeId,
            order: length + 1,
          },
        });
        setOpen(false);
        navigate(0);
      } catch (e: any) {
        alert(e.message);
      }
    },
  });

  useEffect(() => {
    const getContributors = async () => {
      const res = await axios.get(
        `/api/organizations/${id}/projects/${projectId}/contributors`
      );
      setContributors(res.data);
    };

    getContributors();
  }, [id, projectId]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectAssignee = (event: SelectChangeEvent) => {
    formik.setFieldValue("assigneeId", event.target.value as unknown as number);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create new task</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            variant="standard"
            label="Name"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            variant="standard"
            label="Description"
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
          <TextField
            variant="standard"
            label="Deadline"
            id="deadline"
            name="deadline"
            value={formik.values.deadline}
            onChange={formik.handleChange}
            error={formik.touched.deadline && Boolean(formik.errors.deadline)}
            helperText={formik.touched.deadline && formik.errors.deadline}
          />
          <Select
            id="assigneeId"
            value={formik.values.assigneeId as unknown as string}
            label="Assignee"
            onChange={handleSelectAssignee}
          >
            {contributors.map((user) => (
              <MenuItem key={user.userId} value={user.userId}>
                {user.user.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
