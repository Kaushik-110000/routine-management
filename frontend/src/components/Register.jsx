import React, { useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router-dom";
import authService from "../backend/auth.config.js";
import errorTeller from "../backend/errorTeller.js";

export default function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [buttonText, setButtonText] = useState("Register");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setButtonText("Please wait...");

    try {
      const data = new FormData();
      data.append("userName", formData.userName);
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", formData.avatar);

      await authService.register(data);
      alert("Account created successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(errorTeller(err));
      setButtonText("Register");
    }
  };

  return (
    <div className="flex pt-3 px-1 justify-center items-center min-h-screen bg-blue-200">
      <div className="w-full max-w-md bg-blue-900 text-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Create Account
        </h2>
        <p className="text-center text-base text-white/60 mb-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>

        {error && <div className="text-red-400 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            required
            label="Username"
            name="userName"
            placeholder="Enter unique username"
            value={formData.userName}
            onChange={handleChange}
          />

          <Input
            required
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />

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

          <Input
            required
            type="file"
            label="Avatar"
            name="avatar"
            onChange={handleChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
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
