import axios from "axios";
import { API_URL } from "../../../../config/config.jsx";
import { getCookie } from "../../../../utils/cookies.jsx";
import { useEffect, useState } from "react";
import "./showCourses.css";

export const ShowCourses = (props) => {
  const [courses, setCourses] = useState([]);
  const [updateCourse, setUpdateCourse] = useState(false);
  const [updateCourseData, setUpdateCourseData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [newData, setNewData] = useState("");
  const [loader, setLoader] = useState(false);

  const UpdateCourse = (course) => {
    setLoader(true);
    if (newData === "") {
      alert("Course name cannot be empty");
      setLoader(false);
      return;
    }
    axios({
      method: "PATCH",
      url: API_URL + "/update-course/" + course.course_name,
      headers: {
        Token: getCookie("token"),
      },
      data: {
        course_name: newData,
        Id: course.Id,
      },
    })
      .then((res) => {
        console.log(res.data);
        setRefresh(!refresh);
      })
      .catch((err) => {
        alert("Error fetching courses");
        console.log(err);
        return;
      })
      .finally(() => {
        setUpdateCourse(false);
        // setUpdateCourseData({});
        setNewData("");
        setLoader(false);
      });
  };

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
        alert("Error fetching courses");
        console.log(err);
        return;
      })
      .finally(() => {});
  }, [refresh]);

  props.setHeaderTitle("Courses");

  return (
    <>
      {loader && (
        <div className="loader_div">
          <div className="loader"></div>
        </div>
      )}
      <div className="showCourses">
        <div className={`pop_up_overlay ${updateCourse ? "open" : ""}`}>
          <div className={`updateCoursePopUp`}>
            <div className="button_div">
              <h2>Update Course</h2>
              <button
                className="close"
                onClick={() => {
                  setUpdateCourse(false);
                }}
              >
                X
              </button>
            </div>
            <div className="div_form">
              {console.log(updateCourseData)}
              <input
                type="form"
                placeholder={updateCourseData.course_name}
                value={newData}
                className="input_course"
                onChange={(e) => {
                  setNewData(e.target.value);
                }}
              />
              <button
                className="update_button"
                onClick={() => {
                  UpdateCourse(updateCourseData);
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {courses.map((course) => {
          return (
            <div key={course.Id} className="course">
              <p className="p_course">{course.course_name}</p>
              {/* <p>{course.description}</p> */}
              {/* <p>Course ID: {course.Id}</p> */}
              <button
                className="bt"
                onClick={() => {
                  setUpdateCourse(true);
                  setUpdateCourseData(course);
                }}
              >
                Update
              </button>
              <button className="bt">Delete</button>
            </div>
          );
        })}
      </div>
    </>
  );
};
