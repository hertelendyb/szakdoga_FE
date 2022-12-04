import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { sortBy, orderBy } from "lodash";
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
import { toast } from "react-toastify";

import { Comment } from "../Comment/Comment";
import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog/ConfirmDeleteDialog";
import { CreateTaskDialog } from "../CreateTaskDialog/CreateTaskDialog";
import { Log } from "../Log/Log";
import { Task as TaskType } from "../Project/Project";
import { SortableTask } from "../SortableTask/SortableTask";
import { TaskHeader } from "../TaskHeader/TaskHeader";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/slices/userSlice";
import { MoveTaskDialog } from "../MoveTaskDialog/MoveTaskDialog";
import { SectionMarker } from "../SectionMarker/SectionMarker";

import { Box, Button, Chip, Grid, TextField, Typography } from "@mui/material";

import "./Task.css";

type LogType = {
  id: string;
  text: string;
  timestamp: string;
};

type Author = {
  id: number;
  email: string;
  name: string;
  profilePicture: string | null;
};

export type TaskComment = {
  id: number;
  createdAt: string;
  text: string;
  author: Author;
};

export const Task = () => {
  const [showLogs, setShowLogs] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [logs, setLogs] = useState<LogType[]>([]);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [edit, setEdit] = useState(false);
  const [orgContributor, setOrgContributor] = useState(true);
  const [projectContributor, setProjectContributor] = useState(true);
  const [sectionMarker, setSectionMarker] = useState(false);
  const [subtasks, setSubtasks] = useState<TaskType[]>([]);
  const [task, setTask] = useState<TaskType>({
    id: 0,
    name: "",
    description: "",
    order: 0,
    done: false,
    deadline: "",
    assignee: { id: 0, name: "" },
    childTasks: [],
    comments: [],
    parentTask: { id: 0, name: "" },
  });
  const { id, projectId, taskId } = useParams();

  const { orgPermissions, projectPermissions } = useAppSelector(selectUser);

  const getTask = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/organizations/${id}/projects/${projectId}/tasks/${taskId}`
      );
      setTask(res.data);
      setComments(orderBy(res.data.comments, ["createdAt"], ["desc"]));
      setSubtasks(sortBy(res.data.childTasks, ["order"]));
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [id, projectId, taskId]);

  const getLogs = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/organizations/${id}/projects/${projectId}/tasks/${taskId}/logs`
      );
      const ordered = orderBy(res.data, ["timestamp"], ["desc"]);
      setLogs(ordered);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [id, projectId, taskId]);

  useEffect(() => {
    const isOrgContributor = orgPermissions.filter(
      (permission) =>
        permission.roleId === 3 &&
        permission.organizationId === parseInt(id as string, 10)
    );

    const isProjectContributor = projectPermissions.filter(
      (permission) =>
        permission.roleId === 3 &&
        permission.projectId === parseInt(projectId as string, 10)
    );

    if (isOrgContributor.length) {
      setOrgContributor(true);
    } else {
      setOrgContributor(false);
    }

    if (isProjectContributor.length) {
      setProjectContributor(true);
    } else {
      setProjectContributor(false);
    }

    getTask();
    getLogs();
  }, [getLogs, getTask, id, projectId]);

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
      getTask();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  const openMoveDialog = () => {
    setMoveOpen(true);
  };

  const openCreateDialog = () => {
    setEdit(false);
    setSectionMarker(false);
    setCreateOpen(true);
  };

  const openCreateSectionMarkerDialog = () => {
    setEdit(false);
    setSectionMarker(true);
    setCreateOpen(true);
  };

  const openEditDialog = () => {
    setEdit(true);
    setSectionMarker(false);
    setCreateOpen(true);
  };

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTask((task) => {
        const oldIndex = subtasks.findIndex((task) => task.id === active.id);
        const newIndex = subtasks.findIndex((task) => task.id === over.id);

        const newTaskArray = arrayMove(subtasks, oldIndex, newIndex);
        newTaskArray.forEach(
          async (task, index) =>
            await axios.patch(
              `/api/organizations/${id}/projects/${projectId}/tasks/${task.id}`,
              {
                order: index + 1,
              }
            )
        );
        setSubtasks(newTaskArray);
        return { ...task };
      });
    }
  }

  const addComment = async () => {
    try {
      await axios.post(
        `/api/organizations/${id}/projects/${projectId}/tasks/${task.id}/add-comment`,
        {
          text: newComment,
        }
      );
      getTask();
      setNewComment("");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Grid container>
      <Grid item xs={5}>
        <Link to={`/organization/${id}/project/${projectId}`}>
          Back to project
        </Link>
        <Typography variant="h5">{task?.name}</Typography>
        <Typography variant="h6">Description</Typography>
        <Typography variant="body1">{task?.description}</Typography>
        {task?.parentTask ? (
          <>
            <Typography variant="h6">Parent Task</Typography>
            <Typography
              component={Link}
              to={`/organization/${id}/project/${projectId}/task/${task.parentTask.id}`}
              variant="body1"
            >
              {task?.parentTask.name}
            </Typography>
          </>
        ) : null}
        <Typography variant="h6">Deadline</Typography>
        <Typography variant="body1">
          {task?.deadline ? task?.deadline : "-"}
        </Typography>
        <Typography variant="h6">Assignee</Typography>
        <Typography variant="body1">
          {task?.assignee?.name ? task?.assignee?.name : "-"}
        </Typography>
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            width: "max-content",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={openEditDialog}
          >
            Edit task
          </Button>
          <Button variant="contained" onClick={openCreateDialog}>
            Create new subtask
          </Button>
          <Button variant="contained" onClick={openCreateSectionMarkerDialog}>
            Create section marker
          </Button>
          {orgContributor || projectContributor ? null : (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={openDeleteDialog}
              >
                Delete task
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={openMoveDialog}
              >
                Move task
              </Button>
            </>
          )}
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Chip
              sx={!showLogs ? { backgroundColor: "blue", color: "white" } : {}}
              onClick={() => setShowLogs(false)}
              label="Comments"
            />
            <Chip
              sx={showLogs ? { backgroundColor: "blue", color: "white" } : {}}
              onClick={() => setShowLogs(true)}
              label="Logs"
            />
          </Box>
          <Box
            className="scrollbar"
            sx={{
              overflow: "scroll",
              overflowX: "hidden",
              height: "30rem",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "20rem",
            }}
          >
            {showLogs ? (
              logs.map((log) => (
                <Log key={log.id} text={log.text} timestamp={log.timestamp} />
              ))
            ) : (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <TextField
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    variant="outlined"
                  />
                  <Button onClick={addComment} variant="contained">
                    Send
                  </Button>
                </Box>
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    id={comment.id}
                    text={comment.text}
                    createdAt={comment.createdAt}
                    author={comment.author}
                    getTask={getTask}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={7}>
        <Typography variant="h5">Subtasks</Typography>
        <TaskHeader />
        <DndContext
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={subtasks}
            strategy={verticalListSortingStrategy}
          >
            {subtasks.map((task) =>
              task.description ? (
                <SortableTask
                  key={task.id}
                  id={task.id}
                  name={task.name}
                  isDone={task.done}
                  task={task}
                  handleCheck={() => handleCheck(task.id, task.done)}
                />
              ) : (
                <SectionMarker
                  key={task.id}
                  id={task.id}
                  name={task.name}
                  getTask={getTask}
                />
              )
            )}
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
        edit={edit}
        task={task}
        open={createOpen}
        setOpen={setCreateOpen}
        length={task.childTasks?.length || 0}
        getTask={getTask}
        sectionMarker={sectionMarker}
      />
      {orgContributor || projectContributor ? null : (
        <MoveTaskDialog open={moveOpen} setOpen={setMoveOpen} />
      )}
    </Grid>
  );
};
