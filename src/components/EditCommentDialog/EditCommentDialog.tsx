import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

type EditCommentDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  oldComment: string;
  commentId: number;
  getTask: () => void;
};

export const EditCommentDialog = ({
  open,
  setOpen,
  oldComment,
  commentId,
  getTask,
}: EditCommentDialogProps) => {
  const [comment, setComment] = useState("");
  const { id, projectId, taskId } = useParams();

  useEffect(() => setComment(oldComment), [oldComment]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditComment = async () => {
    try {
      await axios({
        method: "patch",
        url: `/api/organizations/${id}/projects/${projectId}/tasks/${taskId}/edit-comment/${commentId}`,
        data: {
          text: comment,
        },
      });
      setOpen(false);
      getTask();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit comment</DialogTitle>
      <DialogContent>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          autoFocus
          margin="dense"
          id="comment"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleEditComment}>Edit</Button>
      </DialogActions>
    </Dialog>
  );
};
