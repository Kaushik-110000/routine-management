import { useState, useEffect } from "react";
import { Navbar } from "./components/index.js";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import authservice from "./backend/auth.config.js";
import {
  login as storeLogin,
  logOut as storeLogout,
} from "./store/authSlice.js";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    authservice
      .checkRefresh()
      .then((res) => {
        if (res.status == 200) {
          authservice
            .refreshTokens()
            .then(() => {
              authservice
                .getCurrentUser()
                .then((res) => {
                  if (res?._id) {
                    dispatch(storeLogin({ userData: res }));
                  } else {
                    dispatch(storeLogout());
                    navigate("/");
                  }
                })
                .catch(() => {
                  dispatch(storeLogout());
                  navigate("/");
                })
                .finally();
            })
            .catch(() => {
              dispatch(storeLogout());
              navigate("/");
            });
        } else {
          dispatch(storeLogout());
        }
      })
      .catch(() => {
        dispatch(storeLogout());
        navigate("/");
      });
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
