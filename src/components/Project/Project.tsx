import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog/ConfirmDeleteDialog";
import { CreateDialog } from "../CreateDialog/CreateDialog";
import { SortableTask } from "../SortableTask/SortableTask";

import {
  Box,
  Typography,
  Grid,
  Button,
  Breadcrumbs,
  Link as MUILink,
} from "@mui/material";

interface Task {
  id: number;
  name: string;
  order: number;
  done: boolean;
}

export const Project = () => {
  const [orgName, projectName]: any = useLoaderData();
  const { id, projectId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 0, name: "", order: 0, done: false },
  ]);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const getTasks = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/organizations/${id}/projects/${projectId}/tasks`
      );
      const tasks: Task[] = sortBy(res.data, ["order"]);
      setTasks(tasks);
    } catch (error) {
      console.log(error);
    }
  }, [id, projectId]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const openCreateDialog = () => {
    setCreateOpen(true);
  };

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);

        const newTaskArray = arrayMove(tasks, oldIndex, newIndex);
        newTaskArray.forEach((task, index) =>
          axios.patch(
            `/api/organizations/${id}/projects/${projectId}/tasks/${task.id}`,
            {
              order: index + 1,
            }
          )
        );
        return newTaskArray;
      });
    }
  }

  const handleCheck = async (taskId: number, isDone: boolean) => {
    try {
      const res = await axios.patch(
        `/api/organizations/${id}/projects/${projectId}/tasks/${taskId}`,
        {
          done: !isDone,
        }
      );
      const taskIndex = tasks.findIndex((task) => task.id === taskId);
      setTasks((prevtasks) => {
        prevtasks[taskIndex] = { ...res.data };
        return [...prevtasks];
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <MUILink underline="hover" color="inherit" href="/home">
          Home
        </MUILink>
        <MUILink underline="hover" color="inherit" href={`/organization/${id}`}>
          {orgName}
        </MUILink>
        <Typography color="text.primary">{projectName}</Typography>
      </Breadcrumbs>
      <Typography variant="h5">{projectName}</Typography>
      <Box>
        <DndContext
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTask
                key={task.id}
                id={task.id}
                name={task.name}
                isDone={task.done}
                handleCheck={() => handleCheck(task.id, task.done)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 3 }}>
        <Button variant="contained" onClick={openCreateDialog}>
          Create new task
        </Button>
        <Button variant="contained" color="error" onClick={openDeleteDialog}>
          Delete project
        </Button>
      </Box>
      <CreateDialog
        open={createOpen}
        setOpen={setCreateOpen}
        isForProject
        orgId={id}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        orgId={id}
      />
    </Box>
  );
};
