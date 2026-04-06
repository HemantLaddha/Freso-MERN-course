import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [markPercentage, setMarkPercentage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      email==="" ||
      password==="" ||
      confirmPassword==="" ||
      name==="" ||
      age.toString()==="" ||
      mobile.toString()==="" ||
      address==="" ||
      markPercentage.toString()===""
    ) {
      setErrorMessage("Please fill all the input fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Confirm Password does not match");
      return;
    }

    try {
      const existingApplicant = await axios.get(
        `/api/applicants?email=${email}`
      );

      if (existingApplicant.data.length > 0) {
        setErrorMessage("Email already exists");
        return;
      }

      await axios.post("/api/applicants", {
        id: new Date().getTime(),
        email,
        password,
        name,
        age,
        mobile,
        address,
        markPercentage,
      });

      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Unable to process signup right now");
    }
  };

  return (
    <div>
      <form className="container mt-2" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Signup</h3>
          <p>Create new account here</p>
        </div>

        <input
          type="text"
          name="email"
          id="email"
          placeholder="enter your email"
          className="form-control mt-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          name="password"
          id="password"
          placeholder="choose password"
          className="form-control mt-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <input
          type="password"
          name="confirmpassword"
          id="confirmpassword"
          placeholder="confirm password"
          className="form-control mt-2"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <input
          type="text"
          name="name"
          id="name"
          placeholder="your name"
          className="form-control mt-2"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          type="number"
          name="age"
          id="age"
          placeholder="your age"
          className="form-control mt-2"
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />

        <input
          type="number"
          name="mobile"
          id="mobile"
          placeholder="your mobile number"
          className="form-control mt-2"
          value={mobile}
          onChange={(event) => setMobile(event.target.value)}
        />

        <textarea
          name="address"
          rows="2"
          cols="50"
          id="address"
          placeholder="your address"
          className="form-control mt-2"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />

        <input
          type="number"
          name="markPercentage"
          id="markPercentage"
          placeholder="Mark Percentage in 12th grade"
          className="form-control mt-2"
          value={markPercentage}
          onChange={(event) => setMarkPercentage(event.target.value)}
        />

        <p className="text-danger" id="errorMessage">
          {errorMessage.toString()}
        </p>

        <button className="btn btn-primary" id="submitButton" type="submit">
          SIGN UP
        </button>

        <div className="form-group pt-3">
          <p>
            Already have an Account <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
