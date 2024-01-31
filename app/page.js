"use client"
import React, { useState } from 'react';
import Login from './Auth/Login';
import Dashboard from './Components/Dashboard';

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [id, setId] = useState("");

  const handleAuthentication = (auth) => {
    if(auth){
      setToken(auth);
      setIsAuthenticated(true);
    }
  };

  const userId = (data) => {
    setId(data._id);
  };

  const handleLogOut = () => {
      setToken("");
      setIsAuthenticated(false);
      console.log("User LOGGED OUT", id);
  };

  return (
    <div>
      {isAuthenticated === true ? (
        <Dashboard handleLogOut={handleLogOut} userId={id}/>
      ) : (
        <Login handleAuthentication={handleAuthentication} userId={userId} />
      )}
    </div>
  );
};
export default Page;