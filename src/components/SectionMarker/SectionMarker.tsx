import React from "react";
import axios from "axios";
import { useSortable } from "@dnd-kit/sortable";
import { useParams } from "react-router-dom";

import {
  Card,
  CardActions,
  IconButton,
  CardContent,
  Typography,
} from "@mui/material";
import { DragHandle } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import { styles } from "./styles";

interface SectionMarkerProps {
  id: number;
  name: string;
  getTasks?: () => void;
  getTask?: () => void;
}

export const SectionMarker = ({
  id: taskId,
  name,
  getTasks = () => null,
  getTask = () => null,
}: SectionMarkerProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: taskId });

  const { id, projectId } = useParams();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteSectionMarker = async () => {
    try {
      await axios.delete(
        `https://lilh91-task-manager-be.herokuapp.com/api/organizations/${id}/projects/${projectId}/tasks/${taskId}`
      );
      getTask();
      getTasks();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Card ref={setNodeRef} style={style} sx={styles.card}>
      <CardActions>
        <IconButton {...attributes} {...listeners} sx={{ cursor: "grab" }}>
          <DragHandle />
        </IconButton>
      </CardActions>
      <CardContent sx={styles.cardContent}>
        <Typography variant="h6">{name}</Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleDeleteSectionMarker}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
