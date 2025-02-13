import { useEffect, useState } from "react";
import "./Add.css";
import axios from "axios";
import { API_URL } from "../../../../config/config";
import { getCookie } from "../../../../utils/cookies";
import { LoaderOverlay } from "../../../Loader/Loader";

export const AddInstructor = (props) => {
  // CONSTANTS
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [instructor, setInstructor] = useState({
    instructor_code: "",
    instructor_name: "",
    department: "",
    course_name: "",
    url: "",
    email: "",
    password: "",
  });
  const [instructorCreated, setInstructorCreated] = useState(false);
  const [instructorAccountPopup, setInstructorAccountPopup] = useState(false);

  props.setHeaderTitle("Add Instructor");
  useEffect(() => {
    document.title = "Add Instructor";
  }, []);

  useEffect(() => {
    setLoading(true);
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
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const createInstructor = () => {
    setLoading(true);
    console.log(loading);
    if (
      instructor.instructor_name === "" ||
      instructor.department === "" ||
      instructor.course_name === "" ||
      instructor.instructor_code === ""
    ) {
      alert("Please fill all the fields");
      setLoading(false);
      return;
    }
    axios({
      method: "POST",
      url: API_URL + "/insert-instructor-details",
      headers: {
        Token: getCookie("token"),
      },
      data: instructor,
    })
      .then(
        (res) => {
          console.log(res.data);
          instructor.url = API_URL + res.data.URL;
          alert("Instructor created successfully");
          setInstructorCreated(true);
        },
        (err) => {
          alert("Error creating instructor");
          console.log(err);
        }
      )
      .catch((err) => {
        alert("Error creating instructor");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const emptyInstructor = () => {
    setInstructor({
      instructor_code: "",
      instructor_name: "",
      department: "",
      course_name: "",
      url: "",
      email: "",
      password: "",
    });
  };

  const createLogin = () => {
    if (instructor.email === "" || instructor.password === "") {
      alert("Please enter email and password");
      return;
    }
    setLoading(true);
    axios({
      method: "GET",
      url: instructor.url
        .replace(":emailid", instructor.email)
        .replace(":password", instructor.password),
      headers: {
        Token: getCookie("token"),
      },
    })
      .then((res) => {
        console.log(res.data);
        alert("Login created successfully");
        emptyInstructor(),
          setInstructorAccountPopup(false),
          setInstructorCreated(false);
      })
      .catch((err) => {
        alert("Error creating login - " + err.response.data);
        console.log(err);
        return;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <LoaderOverlay />}
      <div className="instructor">
        <div className="instructor-form">
          <div className="instructor-form-input">
            <label className="instructor-form-input-label">Name</label>
            <input
              type="text"
              className="instructor-form-input-field"
              value={instructor.instructor_name}
              onChange={(e) => {
                setInstructor({
                  ...instructor,
                  instructor_name: e.target.value,
                });
              }}
            />
          </div>
          <div className="instructor-form-input">
            <label className="instructor-form-input-label">Department</label>
            <input
              type="text"
              value={instructor.department}
              className="instructor-form-input-field"
              onChange={(e) => {
                setInstructor({
                  ...instructor,
                  department: e.target.value,
                });
              }}
            />
          </div>
          <div className="instructor-form-input">
            <label className="instructor-form-input-label">Code</label>
            <input
              type="text"
              value={instructor.instructor_code}
              className="instructor-form-input-field"
              onChange={(e) => {
                setInstructor({
                  ...instructor,
                  instructor_code: e.target.value,
                });
              }}
            />
          </div>
          <div className="instructor-form-input">
            <label className="instructor-form-input-label">Course</label>

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
          <div className="instructor-form-input-button">
            <button
              onClick={() => {
                createInstructor();
              }}
              disabled={instructorCreated}
              style={{ cursor: instructorCreated ? "not-allowed" : "pointer" }}
            >
              {instructorCreated ? "Created" : "Create"}
            </button>
            {instructorCreated && (
              <button
                onClick={() => {
                  setInstructorAccountPopup(true);
                }}
              >
                Create Login
              </button>
            )}
          </div>
        </div>
        <div
          className={`instructor-popup${
            instructorAccountPopup ? " active" : ""
          }`}
        >
          <div className="instructor-popup-content">
            <button
              className="instructor-popup-close"
              onClick={() => {
                setInstructorAccountPopup(false);
              }}
            >
              X
            </button>
            <h1>Add Credentials</h1>
            <p>
              Account has been successfully created. Please create login
              credentials!
            </p>
            <label>Email</label>
            <input
              value={instructor.email}
              type="text"
              onChange={(e) => {
                setInstructor({
                  ...instructor,
                  email: e.target.value,
                });
              }}
            />
            <label>Password</label>
            <input
              type="password"
              value={instructor.password}
              onChange={(e) => {
                setInstructor({
                  ...instructor,
                  password: e.target.value,
                });
              }}
            />
            <button
              className="instructor-popup-button"
              onClick={() => {
                createLogin();
              }}
            >
              Create Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// {
//     "Msg": "successfully created. Create login for accessing db",
//     "Err": "nil",
//     "URL": "/instructor-login-with-id/9ce32086-6eeb-44ad-a409-78f61e6deb9d/:emailid/:password"
// }
