import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

import { Task } from "../Project/Project";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface CreateTaskDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  length: number;
  task?: Task;
  edit?: boolean;
  getTasks?: () => void;
  getTask?: () => void;
  sectionMarker?: boolean;
}

interface Contributor {
  id: number;
  projectId: number;
  roleId: number;
  user: {
    name: string;
  };
  userId: number;
}

export const CreateTaskDialog = ({
  open,
  setOpen,
  length,
  task,
  edit = false,
  getTasks = () => null,
  getTask = () => null,
  sectionMarker = false,
}: CreateTaskDialogProps) => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const { id, projectId, taskId } = useParams();

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: !sectionMarker
      ? yup.string().required("Description is required")
      : yup.string(),
    deadline: yup.date().nullable(),
    assigneeId: yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      name: edit ? task?.name : "",
      description: edit ? task?.description : "",
      deadline: edit ? task?.deadline : null,
      assigneeId: edit ? task?.assignee?.id : 0,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        edit
          ? await axios({
              method: "patch",
              url: `https://lilh91-task-manager-be.herokuapp.com/api/organizations/${id}/projects/${projectId}/tasks/${taskId}`,
              data: {
                name: values.name,
                description: values.description,
                ...(values.deadline ? { deadline: values.deadline } : {}),
                assigneeId: values.assigneeId,
                order: length + 1,
              },
            })
          : await axios({
              method: "post",
              url: `https://lilh91-task-manager-be.herokuapp.com/api/organizations/${id}/projects/${projectId}/tasks${
                taskId ? `/${taskId}` : ""
              }`,
              data: {
                name: values.name,
                description: values.description,
                ...(values.deadline ? { deadline: values.deadline } : {}),
                assigneeId: values.assigneeId,
                order: length + 1,
              },
            });
        setOpen(false);
        !task ? getTasks() : getTask();
      } catch (e: any) {
        toast.error(e.response.data.message);
      }
    },
  });

  useEffect(() => {
    const getContributors = async () => {
      const res = await axios.get(
        `https://lilh91-task-manager-be.herokuapp.com/api/organizations/${id}/projects/${projectId}/contributors`
      );
      setContributors(res.data);
    };

    getContributors();
  }, [id, projectId, open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectAssignee = (event: SelectChangeEvent) => {
    formik.setFieldValue("assigneeId", event.target.value as unknown as number);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {sectionMarker ? (
        <DialogTitle>{"Create section marker"}</DialogTitle>
      ) : (
        <DialogTitle>{edit ? "Edit task" : "Create new task"}</DialogTitle>
      )}

      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
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
          {!sectionMarker ? (
            <>
              <TextField
                variant="standard"
                label="Description"
                id="description"
                name="description"
                multiline
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
              <DatePicker
                label="Deadline"
                inputFormat="yyyy-MM-dd"
                value={formik.values.deadline}
                onChange={(newValue) => {
                  formik.setFieldValue("deadline", newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <FormControl>
                <InputLabel id="assignee-label">Assignee</InputLabel>
                <Select
                  labelId="assignee-label"
                  id="assigneeId"
                  value={
                    formik.values.assigneeId
                      ? (formik.values.assigneeId as unknown as string)
                      : ""
                  }
                  label="Assignee"
                  onChange={handleSelectAssignee}
                >
                  {contributors.map((user) => (
                    <MenuItem key={user.userId} value={user.userId}>
                      {user.user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{edit ? "Edit" : "Create"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
