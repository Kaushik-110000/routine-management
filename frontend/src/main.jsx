import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import {
  Register,
  Professor,
  Classes,
  Login,
  AllDays,
  ScheduleClasses
} from "./components/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Classes /> },
      { path: "/register", element: <Register /> },
      {
        path: "/professors",
        element: <Professor />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/allDays/:classID",
        element: <AllDays />,
      },
      {
        path: "/classes/:classID/schedule/:day",
        element: <ScheduleClasses />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
