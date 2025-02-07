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
          to={ `${BASE_URL}/dashboard`}
          onClick={() => setShowSidePanel(false)}
          className="dashboard_side_panel_link underline"
        >
          Home
        </Link>
        <div>
          <p
            onClick={() => {
              setShowCourseDropdown(!showCourseDropdown);
            }}
            className="underline"
          >
            Course {showCourseDropdown ? <span>-</span> : <span>+</span>}
          </p>
          {showCourseDropdown && (
            <div className="dashboard_side_panel_course_dropdown ">
              <Link
                to={`${BASE_URL}/dashboard/courses/add`}
                onClick={() => {
                  setShowSidePanel(false);
                }}
                className="dashboard_side_panel_dropdown_link dropdwon_underline"
              >
                Add
              </Link>
              <Link
                to={`${BASE_URL}/dashboard/courses`}
                onClick={() => {
                  setShowSidePanel(false);
                }}
                className="dashboard_side_panel_dropdown_link dropdwon_underline"
              >
                Display
              </Link>
            </div>
          )}
        </div>

        <p className="underline">Students</p>
        <p className="underline">Instructors</p>
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
