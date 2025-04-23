import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import authservice from "../backend/auth.config.js";
import { logOut as storeLogout } from "../store/authSlice.js";

export default function Professor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    authservice
      .logout()
      .then(() => {
        dispatch(storeLogout());
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        navigate("/");
      });
  }

  // auth.status is truthy when logged in
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center space-y-4 mt-10">
        <p className="text-xl">Hello, Professor!</p>
        <div className="space-x-4">
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    );
  }

  // Destructure fields from userData
  const { _id, userName, email, fullName, avatar, refreshToken } = userData;

  return (
    <>
      <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Professor Profile</h2>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {_id}
          </p>
          <p>
            <strong>Username:</strong> {userName}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Full Name:</strong> {fullName}
          </p>
          <p>
            <strong>Refresh Token:</strong> {refreshToken}
          </p>
          <div>
            <strong>Avatar:</strong>
            <img
              src={avatar}
              alt="Avatar"
              className="mt-2 h-24 w-24 rounded-full object-cover"
            />
          </div>
        </div>
        <button
          className="bg-red-600 mt-20 h-10 w-20 rounded-4xl float-right"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
}
