import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSeats,
  getApplications,
  getCourses,
  modifyApplicationStatus,
} from "./slice";

function ViewApplications() {
  const dispatch = useDispatch();

  const applications = useSelector((state) => state.app.applications);
  const courses = useSelector((state) => state.app.courses);

  useEffect(() => {
    dispatch(getApplications());
    dispatch(getCourses());
  }, [dispatch]);

  const newApplications = applications.filter(
    (application) => application.status === "Pending"
  );
  const approvedApplications = applications.filter(
    (application) => application.status === "Approved"
  );
  const rejectedApplications = applications.filter(
    (application) => application.status === "Rejected"
  );

  const getAvailableSeatsForCourse = (courseId) => {
    const currentCourse = courses.find(
      (course) => String(course.id) === String(courseId)
    );
    return currentCourse ? Number(currentCourse.availableSeats) : 0;
  };

  const onApprove = async (application) => {
    const availableSeats = getAvailableSeatsForCourse(application.courseId);

    if (availableSeats <= 0) {
      alert("No seats available for this course");
      return;
    }

    await dispatch(
      modifyApplicationStatus({ id: application.id, newStatus: "Approved" })
    );

    await dispatch(
      addSeats({
        id: application.courseId,
        updatedSeatCount: availableSeats - 1,
      })
    );
  };

  const onReject = async (application) => {
    await dispatch(
      modifyApplicationStatus({ id: application.id, newStatus: "Rejected" })
    );
  };

  return (
    <div className="container mt-3">
      <h4 className="text-primary">New Applications</h4>
      <p>No new applications</p>
      <table className="table table-hover mb-5" id="newApplicationsTable">
        <thead>
          <tr>
            <th scope="col">Application Id</th>
            <th scope="col">Course Id</th>
            <th scope="col">Course Name</th>
            <th scope="col">Applicant Name</th>
            <th scope="col">Applicant Email</th>
            <th scope="col">Mark Percentage</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {newApplications.map((application) => {
            const seats = getAvailableSeatsForCourse(application.courseId);
            return (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.courseId}</td>
                <td>{application.courseName}</td>
                <td>{application.applicantName}</td>
                <td>{application.applicantEmail}</td>
                <td>{application.markPercentage}</td>
                <td>
                  <button
                    className="btn btn-success mx-1"
                    onClick={() => onApprove(application)}
                    disabled={seats <= 0}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => onReject(application)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <hr></hr>
      <h4 className="text-primary">Approved Applications</h4>
      <p>No approved applications</p>
      {approvedApplications.length > 0 ? (
        <table
          className="table table-hover mb-5"
          id="approvedApplicationsTable"
        >
          <thead>
            <tr>
              <th scope="col">Application Id</th>
              <th scope="col">Course Id</th>
              <th scope="col">Course Name</th>
              <th scope="col">Applicant Name</th>
              <th scope="col">Applicant Email</th>
              <th scope="col">Mark Percentage</th>
            </tr>
          </thead>
          <tbody>
            {approvedApplications.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.courseId}</td>
                <td>{application.courseName}</td>
                <td>{application.applicantName}</td>
                <td>{application.applicantEmail}</td>
                <td>{application.markPercentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <hr></hr>
      <h4 className="text-primary">Rejected Applications</h4>
      <p>No rejected applications</p>
      {rejectedApplications.length > 0 ? (
        <table
          className="table table-hover mb-5"
          id="rejectedApplicationsTable"
        >
          <thead>
            <tr>
              <th scope="col">Application Id</th>
              <th scope="col">Course Id</th>
              <th scope="col">Course Name</th>
              <th scope="col">Applicant Name</th>
              <th scope="col">Applicant Email</th>
              <th scope="col">Mark Percentage</th>
            </tr>
          </thead>
          <tbody>
            {rejectedApplications.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.courseId}</td>
                <td>{application.courseName}</td>
                <td>{application.applicantName}</td>
                <td>{application.applicantEmail}</td>
                <td>{application.markPercentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

export default ViewApplications;
