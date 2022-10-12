import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { Project } from "../Organization/Organization";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

type MoveTaskDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const MoveTaskDialog = ({ open, setOpen }: MoveTaskDialogProps) => {
  const [newProject, setNewProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const { id, projectId, taskId } = useParams();

  useEffect(() => {
    const getOrganization = async () => {
      try {
        const res = await axios.get(`/api/organizations/${id}`);
        setProjects(res.data.projects);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };

    getOrganization();
  }, [id]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectProject = (event: SelectChangeEvent) => {
    const selected = projects.find(
      (p) => p.id === parseInt(event.target.value)
    );
    setNewProject(selected || null);
  };

  const handleMoveTask = async () => {
    await axios({
      method: "patch",
      url: `/api/organizations/${id}/projects/${projectId}/tasks/${taskId}/move`,
      data: {
        projectId: newProject?.id,
      },
    });
    setOpen(false);
    navigate(`/organization/${id}/project/${projectId}`);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Move task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select where do you want to move the task
        </DialogContentText>
        <FormControl fullWidth>
          <InputLabel id="project-label">Projects</InputLabel>
          <Select
            fullWidth
            labelId="project-label"
            id="projectId"
            value={newProject?.id ? (newProject?.id as unknown as string) : ""}
            label="Projects"
            onChange={handleSelectProject}
          >
            {projects
              .filter((project) => project.id !== parseInt(projectId as string))
              .map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleMoveTask}>Move</Button>
      </DialogActions>
    </Dialog>
  );
};
