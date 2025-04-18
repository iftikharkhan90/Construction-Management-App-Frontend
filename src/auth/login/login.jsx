import React, { useEffect, useState } from "react";
import style from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Cookies from "js-cookie";

export default function Login() {
  useEffect(() => {
    // Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("UserId");
    console.log("Token and Id removed on login page load");
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = formData.email && formData.password;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://construction-management-app-backend-qqvu.vercel.app/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response", response.data);
      console.log("Token", response.data.token);
      console.log("Token", response.data.userId);
      const token = response.data.token;
      const id = response.data.userId;
      localStorage.setItem("token", token);
      localStorage.setItem("UserId", id);
      setFormData({
        email: "",
        password: "",
      });

      if (token) {
        toast.success("User Login Successfully", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/home"),
        });
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(
        "ERROR:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.status === 401) {
        toast.error(
          error.response.data.message || "Given Email or Password is incorrect",
          {
            position: "top-center",
            autoClose: 3000,
          }
        );
      } else {
        toast.error("An Error Occurred. Try again later.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className={`${style.bgPic} text-center p-5`}>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className={`${style.log} container p-5`}
      >
        <h1>: Login :</h1>
        <div className="form-floating mb-3 mt-4">
          <input
            type="email"
            className="form-control"
            placeholder="name@example.com"
            onChange={handleChange}
            value={formData.email}
            required
            name="email"
          />
          <label>Email address :</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            name="password"
            required
          />
          <label>Password :</label>
        </div>

        <button
          type="submit"
          className={`btn btn-info m-5 mb-1 ${!isFormValid ? "disabled" : ""}`}
        >
          Login
        </button>
        <br />

        <Link to={"/sign"} className={`btn btn-secondary mt-2`}>
          Sign Up for register
        </Link>
      </form>
      <ToastContainer />
    </div>
  );
}
