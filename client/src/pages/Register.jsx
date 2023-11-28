import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://airbnb-9av7.onrender.com/register", {
        name,
        email,
        password,
      });

      setRedirect(true);
    } catch (error) {
      alert("Registration failed! Please try again later...");
    }
  };

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            className="outline-0"
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="outline-0"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="outline-0"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already registered?
            <Link className="underline text-black" to={"/login"}>
              {" "}
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
