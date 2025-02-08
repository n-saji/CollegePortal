import axios from "axios";
import { API_URL } from "../../../../config/config.jsx";
import { getCookie } from "../../../../utils/cookies.jsx";
import { useEffect, useState } from "react";
import "./showCourses.css";
import { LoaderOverlay } from "../../../Loader/Loader.jsx";

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
      })
      .catch((err) => {
        alert("Error fetching courses");
        console.log(err);
        return;
      })
      .finally(() => {
        setUpdateCourse(false);
        setNewData("");
        setLoader(false);
        setRefresh(!refresh);
      });
  };

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
        alert("Error updating course");
        console.log(err);
        return;
      })
      .finally(() => {
        setLoader(false);
      });
  }, [refresh]);

  props.setHeaderTitle("Course Catalog");

  const DeleteCourse = (course) => {
    setLoader(true);
    axios({
      method: "DELETE",
      url: API_URL + "/delete-course/" + course.course_name,
      headers: {
        Token: getCookie("token"),
      },
    })
      .then((res) => {
        console.log(res.data);
        setRefresh(!refresh);
      })
      .catch((err) => {
        alert("Error:"+ err.response.data.Message);
        console.log();
        return;
      })
      .finally(() => {
        setLoader(false);
        setRefresh(!refresh);
        setUpdateCourse(false);
        setNewData("");
      });
  };

  return (
    <>
      {loader ? <LoaderOverlay /> : null}
      <div className="showCourses">
        <div className={`pop_up_overlay ${updateCourse ? "open" : ""}`}>
          <div className={`updateCoursePopUp`}>
            <div className="button_div">
              <h2>Edit Course</h2>
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
              <input
                type="form"
                placeholder={updateCourseData.course_name}
                value={newData}
                className="input_course"
                onChange={(e) => {
                  setNewData(e.target.value);
                }}
              />
              <div className="button_div_1">
                <button
                  className="update_button"
                  onClick={() => {
                    UpdateCourse(updateCourseData);
                  }}
                >
                  Update
                </button>
                <button
                  className="delete_button"
                  onClick={() => {
                    DeleteCourse(updateCourseData);
                  }}
                >
                  Delete
                </button>
              </div>
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
                <img src="https://img.icons8.com/ios/20/edit--v1.png" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
