import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoggedUser } from "./slice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user data from Redux store
  const user = useSelector((state) => state.app.loggedUser);
  const isAdmin = user ? user.isAdmin : false;
  const username = user ? user.name : "User";

  const handleLogout = () => {
    dispatch(setLoggedUser(null));
    navigate("", { replace: true });
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-primary text-light e-100 px-5 justify-content-between">
        <h5>Student Admission Portal</h5>

        {/* If logged user is admin */}
        {isAdmin ? (
          <ul className="navbar-nav">
            <li className="nav-item px-2 pt-2">
              <Link className="tab" to="/applications">
                Applications
              </Link>
            </li>

            <li className="nav-item px-2 pt-2">
              <Link className="tab" to="/addseats">
                Add Seats
              </Link>
            </li>

            <li className="nav-item mt-2 ms-5 ps-5 me-2 fw-bold">
              User: Admin
            </li>

            <li className="nav-item">
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        ) : (
          /* If logged user is applicant */
          <ul className="navbar-nav">
            <li className="nav-item px-2 pt-2">
              <Link className="tab" to="/apply">
                Apply Course
              </Link>
            </li>

            <li className="nav-item px-2 pt-2">
              <Link className="tab" to="/status">
                Application Status
              </Link>
            </li>

            <li className="nav-item mt-2 ms-5 ps-5 me-2 fw-bold">
              User: {username}
            </li>

            <li className="nav-item">
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </nav>

      <Outlet />
    </div>
  );
};

export default Navbar;
