import "./show.css";
import axios from "axios";
import { API_URL } from "../../../../config/config";
import { LoaderOverlay } from "../../../Loader/Loader";
import { useEffect, useState } from "react";
import { getCookie } from "../../../../utils/cookies";

export const ShowInstructor = (props) => {
  const [instructor, setInstructor] = useState({
    instructor_code: "",
    instructor_name: "",
    department: "",
    course_name: "",
  });
  const [loading, setLoading] = useState(true);
  const [instructorsList, setInstructorsList] = useState([]);
  const [order, setOrder] = useState("instructor_name");
  const [openPopup, setOpenPopup] = useState(false);
  const [courses, setCourses] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    props.setHeaderTitle("Instructor Details");
    document.title = "Instructor Details";
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/retrieve-instructors/${order}`, {
        headers: {
          token: getCookie("token"),
        },
      })
      .then((response) => {
        setInstructorsList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refresh, order]);

  useEffect(() => {
    axios({
      method: "GET",
      url: API_URL + "/retrieve-all-courses",
      headers: {
        token: getCookie("token"),
      },
    })
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        alert("Error updating course");
        console.log(err);
        return;
      })
      .finally(() => {});
  }, []);

  const updateInstructor = () => {
    setLoading(true);
    if (
      instructor.instructor_name === "" ||
      instructor.department === "" ||
      instructor.course_name === "" ||
      instructor.instructor_code === ""
    ) {
      alert("Please fill all the fields");
      return;
    }
    if (!instructor.id) {
      alert("Instructor ID is missing!");
      setLoading(false);
      return;
    }

    axios({
      method: "PATCH",
      url: API_URL + "/update-instructor?instructor_id=" + instructor.id,
      headers: {
        token: getCookie("token"),
      },
      data: instructor,
    })
      .then((res) => {
        console.log(res);
        alert("Instructor updated successfully");
      })
      .catch((err) => {
        alert("Error updating instructor");
        console.log(err);
        return;
      })
      .finally(() => {
        console.log("finally");
        setLoading(false);
        setRefresh(!refresh);
      });
  };

  const deleteInstructor = () => {
    setLoading(true);
    if (!instructor.id) {
      alert("Instructor ID is missing!");
      setLoading(false);
      return;
    }
    axios({
      method: "DELETE",
      url: API_URL + "/delete-instructor",
      headers: {
        token: getCookie("token"),
      },
      data: {
        id: instructor.id,
      },
    })
      .then((res) => {
        console.log(res);
        alert("Instructor deleted successfully");
        setOpenPopup(false);
      })
      .catch((err) => {
        alert("Error deleting instructor");
        console.log(err);
        return;
      })
      .finally(() => {
        console.log("finally");
        setLoading(false);
        setRefresh(!refresh);
      });
  };

  return (
    <>
      {loading && <LoaderOverlay />}
      <div className="instructors-div">
        <div className="instructors-table">
          <table>
            <thead>
              <th>Name</th>
              <th>Department</th>
              <th>Course Name</th>
              <th>Students Enrolled</th>
              <th>Code</th>
              <th>Action</th>
            </thead>
            <tbody>
              {instructorsList.map((instructorD) => {
                let stundenrolled = 0;
                if (
                  instructorD &&
                  instructorD.info &&
                  instructorD.info.students_list
                ) {
                  stundenrolled = instructorD.info.students_list.length;
                }
                return (
                  <tr key={instructorD.id}>
                    <td>{instructorD.instructor_name}</td>
                    <td>{instructorD.department}</td>
                    <td>{instructorD.course_name}</td>
                    <td>{stundenrolled}</td>
                    <td>{instructorD.instructor_code}</td>
                    <td>
                      <img
                        src="https://img.icons8.com/ios/20/edit--v1.png"
                        alt="Edit"
                        onClick={() => {
                          setOpenPopup(true);
                          setInstructor(instructorD);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={`popup${openPopup ? " active" : ""}`}>
          <div className="popup-form">
            <div className="popup-close" onClick={() => setOpenPopup(false)}>
              <p>X</p>
            </div>
            <div className="popup-title">Edit Instructor</div>
            <div className="popup-content">
              <div className="form-group">
                <label htmlFor="instructor_name">Instructor Name</label>
                <input
                  type="text"
                  name="instructor_name"
                  id="instructor_name"
                  value={instructor.instructor_name}
                  onChange={(e) => {
                    setInstructor({
                      ...instructor,
                      instructor_name: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  name="department"
                  id="department"
                  value={instructor.department}
                  onChange={(e) => {
                    setInstructor({
                      ...instructor,
                      department: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="form-group">
                <label>Course</label>

                <select
                  value={instructor.course_name}
                  onChange={(e) => {
                    setInstructor({
                      ...instructor,
                      course_name: e.target.value,
                    });
                  }}
                >
                  <option value="">{instructor.course_name}</option>
                  {courses.map((course) => (
                    <option value={course.course_id} key={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="instructor_code">Instructor Code</label>
                <input
                  type="text"
                  name="instructor_code"
                  id="instructor_code"
                  value={instructor.instructor_code}
                  onChange={(e) => {
                    setInstructor({
                      ...instructor,
                      instructor_code: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="form-group-bt">
                <button
                  type="button"
                  onClick={() => {
                    updateInstructor();
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    deleteInstructor();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

