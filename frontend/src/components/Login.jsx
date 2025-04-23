import React, { useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router-dom";
import authService from "../backend/auth.config.js";
import errorTeller from "../backend/errorTeller.js";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../store/authSlice.js";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [buttonText, setButtonText] = useState("Login");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setButtonText("Please wait...");
    try {
      await authService.login(formData);

      const user = await authService.getCurrentUser();
      if (user) {
        dispatch(storeLogin({ userData: user }));
        navigate(`/professors`);
      }

      navigate("/professors");
    } catch (err) {
      setError(errorTeller(err));
      setButtonText("Login");
    }
  };

  return (
    <div className="flex justify-center px-1 items-center min-h-screen bg-blue-200">
      <div className="w-full max-w-md bg-blue-900 text-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">Sign In</h2>
        <p className="text-center text-base text-white/60 mb-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>

        {error && <div className="text-red-400 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            required
            type="email"
            label="Email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            required
            type="password"
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-500 text-white py-2 px-4 rounded-xl transition duration-200"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
