import axios from "axios";
import { API_URL } from "../../../../config/config.jsx";
import { getCookie } from "../../../../utils/cookies.jsx";
import { useEffect, useState } from "react";
import "./showCourses.css";

export const ShowCourses = (props) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios({
      method: "GET",
      url: API_URL + "/retrieve-all-courses",
      headers: {
        token: getCookie("token"),
      },
    })
      .then((res) => {
        console.log(res.data);
        setCourses(res.data);
      })
      .catch((err) => {
        alert("Error fetching courses");
        console.log(err);
        return;
      })
      .finally(() => {});
  }, []);

  props.setHeaderTitle("Courses");


  return (
    <div className="showCourses">
      {courses.map((course) => {
        return (
          <div key={course.Id} className="course">
            <p className="p_course">{course.course_name}</p>
            {/* <p>{course.description}</p> */}
            {/* <p>Course ID: {course.Id}</p> */}
            <button className="bt">Update</button>
            <button className="bt">Delete</button>
          </div>
        );
      })}
    </div>
  );
};
