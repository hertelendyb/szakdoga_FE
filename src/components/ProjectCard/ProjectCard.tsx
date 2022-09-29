import React from "react";

import { Card, CardContent } from "@mui/material";

type ProjectCardProps = {
  name: string;
};

export const ProjectCard = ({ name }: ProjectCardProps) => {
  return (
    <Card sx={{ width: 200 }}>
      <CardContent sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {name}
      </CardContent>
    </Card>
  );
};
