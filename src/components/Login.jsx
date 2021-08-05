import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useState } from "react";
import "./login.css";

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  //Handlers
  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://map-api-cr1337.herokuapp.com/api/user/login", data);
      myStorage.setItem("user", res.data.user.username);
      setCurrentUser(myStorage.getItem("user"));
      setShowLogin(false);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>Map App</span>
      </div>
      <form action="" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="username"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button className="registerBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>

      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
};

export default Login;
