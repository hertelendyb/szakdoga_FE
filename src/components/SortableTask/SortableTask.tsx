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
  IconButton,
  Typography,
} from "@mui/material";
import { DragHandle } from "@mui/icons-material";

type SortableTaskProps = {
  id: number;
  name: string;
  isDone: boolean;
  task: Task;
  handleCheck: () => void;
};

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
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        my: 2,
      }}
    >
      <CardActions>
        <IconButton {...attributes} {...listeners} sx={{ cursor: "grab" }}>
          <DragHandle />
        </IconButton>
      </CardActions>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <Link to={`/organization/${id}/project/${projectId}/task/${taskId}`}>
          {name}
        </Link>
        <Typography>
          {task.assignee?.name ? task.assignee.name : "No assignee"}
        </Typography>
        <Typography>{task.deadline ? task.deadline : "No deadline"}</Typography>
        <Typography>
          {task.childTasks?.length
            ? `${task.childTasks.length} subtask(s)`
            : "No subtasks"}
        </Typography>
      </CardContent>
      <CardActions>
        <Checkbox checked={isDone} onChange={handleCheck} />
      </CardActions>
    </Card>
  );
};
