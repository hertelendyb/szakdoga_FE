import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { useLoaderData, useParams } from "react-router-dom";
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
import { SortableTask } from "../SortableTask/SortableTask";
import { CreateTaskDialog } from "../CreateTaskDialog/CreateTaskDialog";
import { TaskComment } from "../Task/Task";
import { AddUserDialog } from "../AddUserDialog/AddUserDialog";

import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link as MUILink,
} from "@mui/material";

export interface Task {
  id: number;
  name: string;
  description: string;
  order: number;
  done: boolean;
  deadline: string;
  assignee: {
    id: number;
    name: string;
  };
  childTasks: Task[];
  comments: TaskComment[];
}

export const Project = () => {
  const [orgName, projectName]: any = useLoaderData();
  const { id, projectId } = useParams();
  const [addOpen, setAddOpen] = useState(false);
  const [isPO, setIsPO] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 0,
      name: "",
      description: "",
      order: 0,
      done: false,
      deadline: "",
      assignee: { id: 0, name: "" },
      childTasks: [],
      comments: [],
    },
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

  const openAddContributorDialog = () => {
    setIsPO(false);
    setAddOpen(true);
  };

  const openAddProjectOwnerDialog = () => {
    setIsPO(true);
    setAddOpen(true);
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
                task={task}
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
        <Button
          variant="contained"
          color="secondary"
          onClick={openAddContributorDialog}
        >
          Add contributor to this project
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={openAddProjectOwnerDialog}
        >
          Add PO to this project
        </Button>
      </Box>
      <CreateTaskDialog
        open={createOpen}
        setOpen={setCreateOpen}
        length={tasks.length}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        orgId={id}
        projectId={projectId}
        deleteProject
      />
      <AddUserDialog
        open={addOpen}
        setOpen={setAddOpen}
        orgId={id}
        projectId={projectId}
        addPO={isPO}
      />
    </Box>
  );
};
