import { validateCookie } from "../../utils/cookies";
import "./dashboard.css";
import { useEffect, useState } from "react";

const validateCookieStatus = (cToken) => {
  if (cToken === "") {
    return false;
  }

  validateCookie(cToken).then((res) => {
    if (res === false) {
      return false;
    }
  });
  return true;
};

export const Dashboard = (props) => {
  if (!validateCookieStatus(props.cToken)) {
    props.setNavigateToDashboard(false);
  }

  const [showSidePanel, setShowSidePanel] = useState(true);

  return (
    <>
      <div className="dashboard">
        <div
          className="dashboard_side_panel"
          style={{ translate: showSidePanel ? "0" : "-18rem" }}
        >
          <div className="dashboard_side_panel_content">
            <p onClick={() => setShowSidePanel(false)}>Home</p>
            <p>Course</p>
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
        <div className="dashboard_header">
          <div className="dashboard_header_title">Dashboard</div>
          <div className="dashboard_header_logout">
            <p>Your Name</p>
            <div className="profile_dropdown"></div>
          </div>
        </div>
      </div>
    </>
  );
};
