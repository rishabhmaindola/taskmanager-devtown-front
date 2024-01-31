"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Login = (props) => {
  const [logIn, setLogIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const logintoggle = () => {
    setLogIn(true);
  };

  const signuptoggle = () => {
    setLogIn(false);
  };

  const signupChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const loginChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCreds) => ({ ...prevCreds, [name]: value }));
  };

  const signup = async () => {
    if (userData.username && userData.email && userData.password) {
      try {
        const response = await axios.post(
          "https://taskmanager-devtown-back.vercel.app/signup",
          userData
        );
        if (response.status === 200) {
          console.log("User data sent successfully:", response.data);
          setUsers((prevUsers) => [...prevUsers, response.data]);
          setUserData({
            username: "",
            email: "",
            password: "",           
          });
          setLogIn(true);
          toast.success('User Registered Successfully!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        } else {
          console.error("Failed to send user data:", response.status);
        }
      } catch (error) {
        console.error("Error sending user data:", error.message);
      }
    } else {
      toast.warn('Please fill in all fields.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  };

  const login = async () => {
    try {
      if (credentials.email && credentials.password) {
        const response = await axios.post(
          "https://taskmanager-devtown-back.vercel.app/login",
          credentials
        );
        if (response.status === 200) {
          const token = response.data.token;
          console.log("User LOGGED IN Successfully", response.data);
          props.handleAuthentication(token);
          props.userId(response.data.user);
          setCredentials({
            email: "",
            password: "",
          });
          console.log(token);
          console.log(response.data.user._id);
        } else {
          console.error("Login failed:", response.status);
        }
      } else {
        toast.warn('Please fill in all fields.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {logIn === false ? (
        <div className="bg-slate-500 flex flex-col gap-5 rounded-sm shadow-lg p-5 py-10 items-center justify-center">
          <h2 className="text-white font-extrabold text-3xl">SIGNUP</h2>
          <input
            type="text"
            name="username"
            placeholder=" Username"
            value={userData.username}
            onChange={signupChange}
            className="p-4 rounded-md shadow-md"
          />
          <input
            type="text"
            name="email"
            placeholder=" Email"
            value={userData.email}
            onChange={signupChange}
            className="p-4 rounded-md shadow-md"
          />
          <input
            type="password"
            name="password"
            placeholder=" Password"
            value={userData.password}
            onChange={signupChange}
            className="p-4 rounded-md shadow-md"
          />
          <div className="flex gap-3 items-center">
            <button
              onClick={signup}
              className="flex bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2.5"
            >
              SignUp
            </button>
            <button
              onClick={logintoggle}
              className="flex bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2.5"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-500 flex flex-col gap-5 rounded-sm shadow-lg p-5 py-10 items-center justify-center">
          <h2 className="text-white font-extrabold text-3xl">LOGIN</h2>
          <input
            type="text"
            placeholder=" Email"
            name="email"
            value={credentials.email}
            onChange={loginChange}
            className="p-4 rounded-md shadow-md"
          />
          <input
            type="password"
            placeholder=" Password"
            name="password"
            value={credentials.password}
            onChange={loginChange}
            className="p-4 rounded-md shadow-md"
          />
          <div className="flex gap-3 items-center">
            <button
              onClick={login}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2.5"
            >
              LogIn
            </button>
            <button
              onClick={signuptoggle}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2.5"
            >
              SignUp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
