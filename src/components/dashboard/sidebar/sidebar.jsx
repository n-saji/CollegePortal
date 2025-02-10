import { useState } from "react";
import "./sidebar.css";
import { BASE_URL } from "../../../config/config";

import { Link } from "react-router-dom";

export const SideBar = () => {
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  return (
    <div
      className="dashboard_side_panel"
      style={{ translate: showSidePanel ? "0" : "-18rem" }}
    >
      <div className="dashboard_side_panel_content">
        <Link
          to={`${BASE_URL}/dashboard`}
          onClick={() => setShowSidePanel(false)}
          className="p_affect"
        >
          Home
        </Link>
        <div className="dashboard_panel_with_dropdown">
          <p
            onClick={() => {
              setShowCourseDropdown(!showCourseDropdown);
            }}
            className={`p_affect ${showCourseDropdown ? "active" : ""}`}
          >
            Course
          </p>

          <div
            className={`dashboard_side_panel_course_dropdown ${
              showCourseDropdown ? "active" : ""
            }`}
          >
            <Link
              to={`${BASE_URL}/dashboard/courses/add`}
              onClick={() => {
                setShowSidePanel(false);
              }}
              className="dashboard_side_panel_dropdown_link dropdown_underline"
            >
              Add
            </Link>
            <Link
              to={`${BASE_URL}/dashboard/courses`}
              onClick={() => {
                setShowSidePanel(false);
              }}
              className="dashboard_side_panel_dropdown_link dropdown_underline"
            >
              Display
            </Link>
          </div>
        </div>

        <p className="p_affect">Students</p>
        <p className="p_affect">Instructors</p>
      </div>
      <button
        className="dashboard_side_panel_toggle_button"
        onClick={() => setShowSidePanel(!showSidePanel)}
      >
        {showSidePanel ? "<" : ">"}
      </button>
    </div>
  );
};
