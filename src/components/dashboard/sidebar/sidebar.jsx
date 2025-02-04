import { useState } from "react";
import "./sidebar.css";

import { Link } from "react-router-dom";

export const SideBar = () => {
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  return (
    <div
      className="dashboard_side_panel"
      style={{ translate: showSidePanel ? "0" : "-18rem" }}
    >
      <div className="dashboard_side_panel_content">
        <Link
          to="/"
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
              <p>Add</p>
              <Link
                to="/courses"
                onClick={() => {
                  setShowSidePanel(false);
                }}
                className="dashboard_side_panel_dropdown_link"
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
