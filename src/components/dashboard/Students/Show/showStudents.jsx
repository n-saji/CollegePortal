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
                    <div
                      className={`overlay_student_table_order ${
                        showActions ? "active" : ""
                      }`}
                    >
                      <div>
                        <div>
                          <select
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              setOrder(selectedValue);
                              setRefresh((prev) => !prev);
                              setShowActions(false);
                            }}
                          >
                            <option value="name">Name</option>
                            <option value="roll_number">Roll Number</option>
                            <option value="age">Age</option>
                            <option value="course_name">Course</option>
                            <option value="marks">Marks</option>
                            <option value="grade">Grade</option>
                          </select>
                        </div>
                      </div>
                    </div>
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

// {
//     "Id": "144d3d4d-b5de-489d-b93c-447d8622df10",
//     "Name": "GST",
//     "RollNumber": "12",
//     "Age": 123,
//     "CourseId": "18753ed0-e06c-4734-bc4d-320c79ea843d",
//     "MarksId": "3f9eb0c6-0139-4568-b1e2-7807c9febc50",
//     "ClassesEnrolled": {
//         "Id": "18753ed0-e06c-4734-bc4d-320c79ea843d",
//         "course_name": "Math"
//     },
//     "StudentMarks": {
//         "Id": "3f9eb0c6-0139-4568-b1e2-7807c9febc50",
//         "StudentId": "144d3d4d-b5de-489d-b93c-447d8622df10",
//         "CourseId": "18753ed0-e06c-4734-bc4d-320c79ea843d",
//         "CourseName": "Math",
//         "Marks": 0,
//         "Grade": "nil"
//     }
// }
