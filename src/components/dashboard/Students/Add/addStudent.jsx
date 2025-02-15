import "./addStudent.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../../../utils/cookies";
import { API_URL } from "../../../../config/config";
import { LoaderOverlay } from "../../../Loader/Loader";
import { Link } from "react-router-dom";
import { GetUserName } from "../../../../utils/helper";

export const AddStudent = (props) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    document.title = "Add Student";
  }, []);
  props.setHeaderTitle("Add Student");

  useEffect(() => {
    setLoader(true);
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
        console.log(err);
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  const handleAddStudent = () => {
    if (!name || !rollNumber || !age || !course) {
      alert("Please fill all the fields");
      return;
    }

    if (isNaN(age) || age < 0 || age > 100) {
      alert("Age should be a number");
      return;
    }

    setLoader(true);
    axios({
      method: "POST",
      url: API_URL + "/insert-student-details",
      headers: {
        token: getCookie("token"),
      },
      data: {
        Name: name,
        RollNumber: rollNumber,
        Age: parseInt(age),
        ClassesEnrolled: {
          course_name: course,
        },
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        alert("Error adding student: " + err.response.data);
        console.log(err);
        setLoader(false);
      })
      .finally(() => {
        setLoader(false);
        setRefresh(!refresh);
        setAge("");
        setName("");
        setRollNumber("");
        setCourse("");
      });
  };

  return (
    <>
      {loader ? <LoaderOverlay /> : null}
      <div className="add_student">
        <div className="add_student_form">
          <div className="add_student_form_input">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="add_student_form_input">
            <label>Roll Number</label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />
          </div>
          <div className="add_student_form_input">
            <label>Age</label>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="add_student_form_input">
            <label>Course</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option value={course.course_id}>{course.course_name}</option>
              ))}
            </select>
          </div>

          <div className="add_student_form_button">
            <button onClick={handleAddStudent} disabled={loader}>
              {loader ? "Processing" : "Add Student"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
