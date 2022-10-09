import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
};

export const EditCommentDialog = ({
  open,
  setOpen,
  oldComment,
  commentId,
}: EditCommentDialogProps) => {
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const { id, projectId, taskId } = useParams();

  useEffect(() => setComment(oldComment), [oldComment]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditComment = async () => {
    await axios({
      method: "patch",
      url: `/api/organizations/${id}/projects/${projectId}/tasks/${taskId}/edit-comment/${commentId}`,
      data: {
        text: comment,
      },
    });
    setOpen(false);
    navigate(0);
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
