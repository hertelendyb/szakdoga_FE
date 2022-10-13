import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Task } from "../Project/Project";

import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { DragHandle } from "@mui/icons-material";
import { styles } from "./styles";

interface SortableTaskProps {
  id: number;
  name: string;
  isDone: boolean;
  task: Task;
  handleCheck: () => void;
}

export const SortableTask = ({
  id: taskId,
  name,
  isDone,
  task,
  handleCheck,
}: SortableTaskProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: taskId });

  const { id, projectId } = useParams();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} sx={styles.card}>
      <CardActions>
        <IconButton {...attributes} {...listeners} sx={{ cursor: "grab" }}>
          <DragHandle />
        </IconButton>
      </CardActions>
      <CardContent sx={styles.cardContent}>
        <Grid container>
          <Grid item xs={3}>
            <Link
              to={`/organization/${id}/project/${projectId}/task/${taskId}`}
            >
              {name}
            </Link>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              {task.assignee?.name ? task.assignee.name : "No assignee"}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              {task.deadline ? task.deadline : "No deadline"}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>
              {task.childTasks?.length
                ? `${task.childTasks.length} subtask(s)`
                : "No subtasks"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Checkbox checked={isDone} onChange={handleCheck} />
      </CardActions>
    </Card>
  );
};
