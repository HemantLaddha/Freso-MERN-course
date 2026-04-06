import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setLoggedUser } from "./slice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = checked
        ? `/api/admin?email=${email}`
        : `/api/applicants?email=${email}`;

      const response = await axios.get(url);
      const users = response.data;

      if (!users[0]) {
        setErrorMessage("Email not registered");
        return;
      }

      if (users[0].password !== password) {
        setErrorMessage("Password is incorrect");
        return;
      }

      setErrorMessage("");

      dispatch(
        setLoggedUser(
          checked
            ? { isAdmin: true, name: "Admin", email: users[0].email }
            : { ...users[0], isAdmin: false }
        )
      );

      if (checked) {
        navigate("/applications");
      } else {
        navigate("/apply");
      }
    } catch (error) {
      setErrorMessage("Unable to process login right now");
    }
  };

  return (
    <div>
      <form className="container mt-5" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3 id="loginHeader">{checked ? "Admin Login" : "Applicant Login"}</h3>
          <div className="float-right">
            <input
              type="checkbox"
              id="userType"
              name="user"
              className="form-check-input"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
            />
            <label className="form-check-label ps-2">Admin</label>
          </div>
          <br />
          <p>Enter your credentials here to Login</p>
        </div>

        <input
          type="email"
          name="email"
          id="userEmail"
          placeholder="your email"
          className="form-control mt-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          name="password"
          id="userPassword"
          placeholder="password"
          className="form-control mt-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <p className="text-danger" id="errorMessage">
          {errorMessage}
        </p>

        <button className="btn btn-primary" id="loginButton" type="submit">
          Login
        </button>

        <div className="form-group pt-3">
          <p>
            Do not have an Account{" "}
            <Link id="signupLink" to="/signup">
              Signup
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
