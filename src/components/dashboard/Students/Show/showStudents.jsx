import "./showStudents.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../../../utils/cookies";
import { BASE_URL, API_URL } from "../../../../config/config";
import { LoaderOverlay } from "../../../Loader/Loader";
import { Link } from "react-router-dom";
import { GetUserName } from "../../../../utils/helper";

export const ShowStudents = (props) => {
  const [loader, setLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [students, setStudents] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [order, setOrder] = useState("name");

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
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
