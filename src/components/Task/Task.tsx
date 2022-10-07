import { DndContext } from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog/ConfirmDeleteDialog";
import { CreateTaskDialog } from "../CreateTaskDialog/CreateTaskDialog";
import { Task as TaskType } from "../Project/Project";
import { SortableTask } from "../SortableTask/SortableTask";

export const Task = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [task, setTask] = useState<TaskType>({
    id: 0,
    name: "",
    description: "",
    order: 0,
    done: false,
    deadline: "",
    assignee: { name: "" },
    childTasks: [],
  });
  const { id, projectId, taskId } = useParams();

  const getTask = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/organizations/${id}/projects/${projectId}/tasks/${taskId}`
      );
      setTask(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [id, projectId, taskId]);

  useEffect(() => {
    getTask();
  }, [getTask]);

  const handleCheck = async (taskId: number, isDone: boolean) => {
    try {
      const res = await axios.patch(
        `/api/organizations/${id}/projects/${projectId}/tasks/${taskId}`,
        {
          done: !isDone,
        }
      );
      const taskIndex = task.childTasks.findIndex((task) => task.id === taskId);
      setTask((prevtask) => {
        prevtask.childTasks[taskIndex] = { ...res.data };
        return { ...prevtask };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  const openCreateDialog = () => {
    setCreateOpen(true);
  };

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTask((task) => {
        const oldIndex = task.childTasks.findIndex(
          (task) => task.id === active.id
        );
        const newIndex = task.childTasks.findIndex(
          (task) => task.id === over.id
        );

        const newTaskArray = arrayMove(task.childTasks, oldIndex, newIndex);
        newTaskArray.forEach((task, index) =>
          axios.patch(
            `/api/organizations/${id}/projects/${projectId}/tasks/${task.id}`,
            {
              order: index + 1,
            }
          )
        );
        task.childTasks = newTaskArray;
        return { ...task };
      });
    }
  }

  return (
    <Grid container>
      <Grid item xs={5}>
        <Typography variant="h5">{task?.name}</Typography>
        <Typography variant="h6">Description</Typography>
        <Typography variant="body1">{task?.description}</Typography>
        <Typography variant="h6">Deadline</Typography>
        <Typography variant="body1">{task?.deadline}</Typography>
        <Typography variant="h6">Assignee</Typography>
        <Typography variant="body1">
          {task?.assignee?.name ? task?.assignee?.name : "-"}
        </Typography>
        <Button variant="contained" onClick={openCreateDialog}>
          Create new subtask
        </Button>
        <Button variant="contained" color="error" onClick={openDeleteDialog}>
          Delete task
        </Button>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="h5">Subtasks</Typography>
        <DndContext
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={task.childTasks}
            strategy={verticalListSortingStrategy}
          >
            {task?.childTasks.map((task) => (
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
      </Grid>
      <ConfirmDeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        orgId={id}
        projectId={projectId}
        taskId={taskId}
        deleteTask
      />
      <CreateTaskDialog
        open={createOpen}
        setOpen={setCreateOpen}
        length={task.childTasks?.length || 0}
      />
    </Grid>
  );
};
