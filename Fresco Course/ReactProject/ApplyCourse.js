import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCourses, getApplicationStatus } from "./slice";

function ApplyCourse() {
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.app.courses);
  const userApplications = useSelector((state) => state.app.applicationStatus);
  const loggedUser = useSelector((state) => state.app.loggedUser);

  useEffect(() => {
    dispatch(getCourses());

    if (loggedUser && loggedUser.email) {
      dispatch(getApplicationStatus({ email: loggedUser.email }));
    }
  }, [dispatch, loggedUser]);

  const applyCourse = async (course) => {
    if (!loggedUser) {
      return;
    }

    const alreadyApplied = userApplications.some(
      (application) => String(application.courseId) === String(course.id)
    );

    if (alreadyApplied) {
      alert("You have already applied for this course");
      return;
    }

    if (Number(course.availableSeats) <= 0) {
      alert("Seats are not available for this course");
      return;
    }

    const requestBody = {
      id: new Date().getTime(),
      applicantEmail: loggedUser.email,
      applicantName: loggedUser.name,
      courseId: course.id,
      courseName: course.courseName,
      status: "Pending",
      markPercentage: loggedUser.markPercentage,
    };

    await axios.post("/api/applications", requestBody);
    alert("Your application submitted successfully");

    if (loggedUser.email) {
      dispatch(getApplicationStatus({ email: loggedUser.email }));
    }
  };

  return (
    <div className="container">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Course Id</th>
            <th scope="col">Course Name</th>
            <th scope="col">Available Seats</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.courseName}</td>
              <td>{course.availableSeats}</td>
              <td>
                <button
                  className="btn btn-outline-success mx-1"
                  onClick={() => applyCourse(course)}
                >
                  Apply
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplyCourse;
