import "./showStudents.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../../../utils/cookies";
import { BASE_URL, API_URL } from "../../../../config/config";
import { LoaderOverlay } from "../../../Loader/Loader";
import { parse } from "dotenv";

export const ShowStudents = (props) => {
  const [loader, setLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [students, setStudents] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [order, setOrder] = useState("name");
  const [updateStudentPopup, setUpdateStudentPopup] = useState(false);
  const [courses, setCourses] = useState([]);
  const [updateStudentDetails, setUpdateStudentDetails] = useState({
    Id: "",
    Name: "",
    RollNumber: "",
    Age: "",
    ClassesEnrolled: {
      course_name: "",
    },
    StudentMarks: {
      Marks: "",
    },
  });

  useEffect(() => {
    document.title = "Students";
  }, []);
  props.setHeaderTitle("Students List");

  useEffect(() => {
    setLoader(true);
    axios({
      method: "GET",
      url: API_URL + `/retrieve-college-administration?order=${order}`,
      headers: {
        token: getCookie("token"),
      },
    })
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [refresh]);


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
      });
  }, []);

  const updateStudent = () => {
    setLoader(true);
    axios({
      method: "PATCH",
      url: API_URL + "/v2/update-student-details",
      headers: {
        Token: getCookie("token"),
      },
      data: {
        Id: updateStudentDetails.Id,
        Name: updateStudentDetails.Name,
        RollNumber: updateStudentDetails.RollNumber,
        Age: parseInt(updateStudentDetails.Age),
        ClassesEnrolled: {
          course_name: updateStudentDetails.ClassesEnrolled.course_name,
        },
        StudentMarks: {
          Marks: parseInt(updateStudentDetails.StudentMarks.Marks),
        },
      },
    })
      .then((res) => {
        setUpdateStudentPopup(false);
        setRefresh((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
        alert("Error updating student details");
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      <div className="show_students">
        <div className={`overlay-right ${showActions ? "active" : ""}`}>
          <div className="overlay-right-content">
            <div className="overlay-right-close">
              <button
                onClick={() => {
                  setShowActions(!showActions);
                }}
              >
                X
              </button>
            </div>
            <p>Sort By</p>
            <button
              className="bt-overlay-right-content"
              onClick={() => {
                setOrder("name");
                setRefresh((prev) => !prev);
                setShowActions(false);
              }}
            >
              Name
            </button>
            <button
              className="bt-overlay-right-content"
              onClick={() => {
                setOrder("roll_number");
                setRefresh((prev) => !prev);
                setShowActions(false);
              }}
            >
              Roll Number
            </button>
            <button
              className="bt-overlay-right-content"
              onClick={() => {
                setOrder("age");
                setRefresh((prev) => !prev);
                setShowActions(false);
              }}
            >
              Age
            </button>
            <button
              className="bt-overlay-right-content"
              onClick={() => {
                setOrder("course_name");
                setRefresh((prev) => !prev);
                setShowActions(false);
              }}
            >
              Course
            </button>

            <button
              className="bt-overlay-right-content"
              onClick={() => {
                setOrder("marks");
                setRefresh((prev) => !prev);
                setShowActions(false);
              }}
            >
              Marks
            </button>
            <button
              className="bt-overlay-right-content"
              onClick={() => {
                setOrder("grade");
                setRefresh((prev) => !prev);
                setShowActions(false);
              }}
            >
              Grade
            </button>
          </div>
        </div>
        {loader ? <LoaderOverlay /> : null}
        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Age</th>
                <th>Course</th>
                <th>Marks</th>
                <th>Grade</th>
                <th className="dev_action">
                  <div className="edit_table_text">Action</div>
                  <div className="edit_table_button">
                    <img
                      src="https://img.icons8.com/ios/50/ellipsis.png"
                      onClick={() => {
                        setShowActions(!showActions);
                      }}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                return (
                  <tr key={student.Id}>
                    <td>{student.Name}</td>
                    <td>{student.RollNumber}</td>
                    <td>{student.Age}</td>
                    <td>{student.ClassesEnrolled.course_name}</td>
                    <td>{student.StudentMarks.Marks}</td>
                    <td>{student.StudentMarks.Grade}</td>
                    <td className="action">
                      <img
                        className="bt"
                        src="https://img.icons8.com/ios/20/edit--v1.png"
                        onClick={() => {
                          setUpdateStudentPopup(true);
                          setUpdateStudentDetails(student);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className={`update-student-popup ${
            updateStudentPopup ? "active" : ""
          }`}
        >
          <div className="update-student-popup-content">
            <div className="form-input">
              <label>Name</label>
              <input
                value={updateStudentDetails.Name}
                onChange={(e) => {
                  setUpdateStudentDetails({
                    ...updateStudentDetails,
                    Name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form-input">
              <label>Roll Number</label>
              <input
                value={updateStudentDetails.RollNumber}
                onChange={(e) => {
                  setUpdateStudentDetails({
                    ...updateStudentDetails,
                    RollNumber: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form-input">
              <label>Age</label>
              <input
                value={updateStudentDetails.Age}
                onChange={(e) => {
                  setUpdateStudentDetails({
                    ...updateStudentDetails,
                    Age: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form-input">
              <label>Course</label>

              <select
                value={updateStudentDetails.ClassesEnrolled.course_name}
                onChange={(e) => {
                  setUpdateStudentDetails({
                    ...updateStudentDetails,
                    ClassesEnrolled: {
                      ...updateStudentDetails.ClassesEnrolled,
                      course_name: e.target.value,
                    },
                  });
                }}
              >
                <option value="">
                  {updateStudentDetails.ClassesEnrolled.course_name}
                </option>
                {courses.map((course) => (
                  <option value={course.course_id}>{course.course_name}</option>
                ))}
              </select>
            </div>

            <div className="form-input">
              <label>Marks</label>
              <input
                value={updateStudentDetails.StudentMarks.Marks}
                onChange={(e) => {
                  setUpdateStudentDetails({
                    ...updateStudentDetails,
                    StudentMarks: {
                      ...updateStudentDetails.StudentMarks,
                      Marks: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="form-buttons">
              <button
                onClick={() => {
                  updateStudent(updateStudentDetails);
                }}
              >
                Update
              </button>
              <button
                onClick={() => {
                  setUpdateStudentPopup(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
