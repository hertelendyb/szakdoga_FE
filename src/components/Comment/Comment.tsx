import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/slices/userSlice";
import { TaskComment } from "../Task/Task";
import { EditCommentDialog } from "../EditCommentDialog/EditCommentDialog";
import { ConfirmDeleteDialog } from "../ConfirmDeleteDialog/ConfirmDeleteDialog";
import { formatDate } from "../../utils/formatDate";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Box, IconButton, Typography } from "@mui/material";

interface CommentProps extends TaskComment {
  getTask: () => void;
}

export const Comment = ({
  id: commentId,
  text,
  createdAt,
  author,
  getTask,
}: CommentProps) => {
  const [open, setOpen] = useState(false);
  const [formatedTime, setFormatedTime] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const { id, projectId, taskId } = useParams();

  const { user } = useAppSelector(selectUser);

  useEffect(() => {
    const time = formatDate(createdAt);
    setFormatedTime(time);
  }, [createdAt]);

  const editComment = () => {
    setEditOpen(true);
  };

  const deleteComment = () => {
    setOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid grey",
        pb: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar
          alt={author.name}
          src={author.profilePicture ? author.profilePicture : undefined}
        />
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="caption">{author.name}</Typography>
            <Typography variant="caption">{formatedTime}</Typography>
          </Box>
          <Typography variant="body1">{text}</Typography>
        </Box>
      </Box>
      {author.id === user.id ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <IconButton onClick={editComment} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={deleteComment} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : null}
      <ConfirmDeleteDialog
        orgId={id}
        projectId={projectId}
        taskId={taskId}
        commentId={commentId}
        open={open}
        setOpen={setOpen}
        deleteComment
      />
      <EditCommentDialog
        open={editOpen}
        setOpen={setEditOpen}
        oldComment={text}
        commentId={commentId}
        getTask={getTask}
      />
    </Box>
  );
};
