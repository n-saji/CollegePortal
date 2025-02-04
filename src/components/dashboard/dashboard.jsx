import { validateCookie } from "../../utils/cookies";
export const Dashboard = ({ cToken, setNavigateToDashboard }) => {
  console.log(cToken);
  console.log(validateCookie(cToken));
  if (cToken === "") {
    setNavigateToDashboard(false);
  }
  validateCookie(cToken).then((res) => {
    if (res === false) {
      setNavigateToDashboard(false);
    }
  });

  return (
    <>
      <div className="dashboard">
        <div className="dashboard_window">
          <div className="dashboard_window_title">
            <h1>Dashboard</h1>
          </div>

          <div className="dashboard_window_content">
            <div className="dashboard_window_content_title">
              <h2>Content</h2>
            </div>
            <div className="dashboard_window_content_list">
              <ul>
                <li>Content 1</li>
                <li>Content 2</li>
                <li>Content 3</li>
                <li>Content 4</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
