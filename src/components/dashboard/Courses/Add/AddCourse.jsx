import "./AddCourse.css";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../config/config.jsx";
import { getCookie } from "../../../../utils/cookies.jsx";

export const AddCourse = (props) => {
  const [courseName, setCourseName] = useState("");
  const [loader, setLoader] = useState(false);
  props.setHeaderTitle("Courses");
  document.title = "Courses";

  const AddCourse = () => {
    setLoader(true);
    if (courseName === "") {
      alert("Course name cannot be empty");
      setLoader(false);
      return;
    }
    axios({
      method: "POST",
      url: API_URL + "/insert-course",
      headers: {
        Token: getCookie("token"),
      },
      data: {
        course_name: courseName,
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        alert("Error adding course");
        console.log(err);
        return;
      })
      .finally(() => {
        setCourseName("");
        setLoader(false);
      });
  };

  return (
    <div className="add-course">
      <div className="add-course-container">
        <div className="add-course-header">Add Course</div>
        <div className="add-course-body">
          <input
            type="text"
            placeholder="Course Name"
                      value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <button onClick={AddCourse} disabled={loader}>
            {loader ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};
