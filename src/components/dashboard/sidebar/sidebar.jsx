import { useState } from "react";
import "./sidebar.css";
export const SideBar = () => {
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  return (
    <div
      className="dashboard_side_panel"
      style={{ translate: showSidePanel ? "0" : "-18rem" }}
    >
      <div className="dashboard_side_panel_content">
        <p onClick={() => setShowSidePanel(false)}>Home</p>
        <div>
          <p
            onClick={() => {
              setShowCourseDropdown(!showCourseDropdown);
            }}
          >
            Course {showCourseDropdown ? <span>-</span> : <span>+</span>}
          </p>
          {showCourseDropdown && (
            <div className="dashboard_side_panel_course_dropdown">
              <p>Add</p>
              <p>Display</p>
            </div>
          )}
        </div>

        <p>Students</p>
        <p>Instructors</p>
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
