import { Room, Cancel } from "@material-ui/icons";
import React, { useState } from "react";
import axios from "axios";
import "./register.css";

const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  //Handlers
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://map-api-cr1337.herokuapp.com/api/user/register", data);
      setSuccess(true);
      setError(false);
    } catch {
      setSuccess(false);
      setError(true);
    }
  };
  return (
    <div className="registerCointainer">
      <div className="logo">
        <Room />
        Map App
      </div>
      <form action="" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="username"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && <span className="success">You can login now!</span>}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
};
export default Register;
