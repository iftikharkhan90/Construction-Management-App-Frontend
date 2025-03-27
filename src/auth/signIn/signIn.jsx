import React, { useState } from 'react';
import style from './signIn.module.css';
import { Link,  useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
console.log(formData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = formData.name && formData.email && formData.password;


const navigate = useNavigate();
console.log("hey");

const handleSubmit = async (e)=>{
  e.preventDefault()
  try {
          // const data = new FormData();
          // data.append("name", formData.name);
          // data.append("email", formData.email);
          // data.append("password", formData.password);
const response = await axios.post(
  "http://localhost:3002/api/signup",
  formData,
);
    console.log("oka hy");
    console.log("Response" , response.data);
        
    setFormData({
      name:"",
      email:"",
      password:""
    })
    navigate('/')
  } catch (error) {
    if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "User Already Exists!" , {position: 'top-center' , autoClose:3000});
    } else {
      console.error(
        "ERROR",
        error.response ? error.response.data : error.message
      );
      toast.error("An error occured . Please try again later" , {position:'top-center' , autoClose:3000})
    } 
  }

}


  return (
    <div className={`${style.oka} p-5`}>
      <center>
        <form
          onSubmit={handleSubmit}
          method="POST"
          className={`${style.sign} p-5`}
        >
          <h1> : Sign in :</h1>

          <div className="form-floating mb-3 mt-4">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Enter your name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="floatingInput">Name :</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="Enter your email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="floatingEmail">Email address :</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Enter your password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="floatingPassword">Password :</label>
          </div>
            <button
              type="submit"
              className={`btn btn-success ${!isFormValid ? "disabled" : ""}`}
            >
              Sign in
            </button>
        </form>
      </center>
      <ToastContainer/>
    </div>
  );
}
