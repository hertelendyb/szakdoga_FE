import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ToastContainer } from "react-toastify";

import { store } from "./store/store";
import { layoutLoader } from "./components/Layout/Layout";
import { loginLoader } from "./components/Login/Login";
import {
  Home,
  Layout,
  Login,
  Organization,
  Project,
  SignUp,
  Task,
} from "./components";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    loader: loginLoader,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <Layout />,
    loader: layoutLoader,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/organization/:id",
        element: <Organization />,
        loader: async ({ params }) => {
          const res = await axios.get(`/api/organizations/${params.id}`);
          return res.data.name;
        },
      },
      {
        path: "/organization/:id/project/:projectId",
        element: <Project />,
        loader: async ({ params }) => {
          const project = await axios.get(
            `/api/organizations/${params.id}/projects/${params.projectId}`
          );
          return [project.data.organization.name, project.data.name];
        },
      },
      {
        path: "/organization/:id/project/:projectId/task/:taskId",
        element: <Task />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ToastContainer />
        <RouterProvider router={router} />
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
