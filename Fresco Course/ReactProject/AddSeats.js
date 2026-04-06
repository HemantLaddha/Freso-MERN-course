import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSeats, getCourses } from "./slice";

const AddSeats = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.app.courses);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [newSeatCount, setNewSeatCount] = useState("");

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  const selectedCourse = courses.find(
    (course) => String(course.id) === String(selectedCourseId)
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCourseId || newSeatCount === "") {
      return;
    }

    await dispatch(
      addSeats({
        id: selectedCourseId,
        updatedSeatCount: Number(newSeatCount),
      })
    );

    alert("Seat count updated successfully");
  };

  return (
    <div>
      <form className="container mt-5" onSubmit={handleSubmit}>
        <label className="px-2">
          Course:
          <select
            className="form-select"
            id="courseSelect"
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
          >
            <option value="" disabled>
              Select Course
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {`${course.courseName} (Id: ${course.id})`}
              </option>
            ))}
          </select>
        </label>

        <label className="px-2" id="availableSeats">
          Available Seats: {selectedCourse ? selectedCourse.availableSeats : "--count--"}
          <input
            type="number"
            className="form-control"
            id="newSeatCount"
            placeholder="New count"
            value={newSeatCount}
            onChange={(event) => setNewSeatCount(event.target.value)}
          />
        </label>

        <input
          type="submit"
          className="btn btn-primary"
          id="submitButton"
          value="Submit"
        />
      </form>
    </div>
  );
};

export default AddSeats;