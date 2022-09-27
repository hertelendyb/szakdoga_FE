import { Box, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Organizations {
  id: number | null;
  name: string;
}

export const Home = () => {
  const [organizations, setOrganizations] = useState<[Organizations]>([
    {
      id: null,
      name: "No organization found",
    },
  ]);
  const [projects, setProjects] = useState<[Organizations]>([
    {
      id: null,
      name: "No project found",
    },
  ]);

  const getOrgsAndProjects = async () => {
    const orgResponse: any = await axios.get("api/organizations");
    if (orgResponse.data instanceof Array) {
      setOrganizations(orgResponse.data);
    }
    const projectResponse: any = await axios.get("api/users/myProjects");
    if (projectResponse.data instanceof Array) {
      setProjects(projectResponse.data);
    }
  };

  useEffect(() => {
    getOrgsAndProjects();
    axios.get("api/users/me");
  }, []);

  return (
    <Box>
      <ul title="orgs">
        {organizations.map((organization) => (
          <li key={organization.id || 1}>{organization.name}</li>
        ))}
      </ul>
      <ul title="projects">
        {projects.map((project) => (
          <li key={project.id || 1}>{project.name}</li>
        ))}
      </ul>
      <Button onClick={async () => axios.get("api/users/logout")}>
        Logout
      </Button>
    </Box>
  );
};
