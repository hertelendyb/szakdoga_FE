import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  IconButton,
} from "@mui/material";
import { DragHandle } from "@mui/icons-material";

type SortableTaskProps = {
  id: number;
  name: string;
  isDone: boolean;
  handleCheck: () => void;
};

export const SortableTask = ({
  id,
  name,
  isDone,
  handleCheck,
}: SortableTaskProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        width: 200,
        display: "flex",
        flexDirection: "row",
        my: 2,
      }}
    >
      <CardActions>
        <IconButton {...attributes} {...listeners} sx={{ cursor: "grab" }}>
          <DragHandle />
        </IconButton>
      </CardActions>
      <CardContent sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {name}
      </CardContent>
      <CardActions>
        <Checkbox checked={isDone} onChange={handleCheck} />
      </CardActions>
    </Card>
  );
};
