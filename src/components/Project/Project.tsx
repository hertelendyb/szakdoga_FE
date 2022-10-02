import React from "react";
import { useLoaderData } from "react-router-dom";

export const Project = () => {
  const projectName = useLoaderData();

  return <div>{projectName as string}</div>;
};
