import backButton from "../../assets/back_button.png";
import { data, Link } from "react-router-dom";
import { BASE_URL, API_URL } from "../../config/config";
import "./Profile.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookies";
import editButton from "../../assets/edit.png";
export const Profile = () => {
  useEffect(() => {
    document.title = "Profile";
  }, []);
  const [email, setEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [department, setDepartment] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateCredentials, setUpdateCredentials] = useState(false);
  const account_id = getCookie("account_id");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    axios({
      method: "GET",
      url: API_URL + "/view-profile-instructor/" + account_id,
      headers: {
        Token: getCookie("token"),
      },
    })
      .then((res) => {
        console.log(res.data);
        setEmail(res.data.Credentials.email_id);
        setOldEmail(res.data.Credentials.email_id);
        // setPassword(res.data.Credentials.password.substring(0, 10));
        setDepartment(res.data.Department);
        setCode(res.data.Code);
        setName(res.data.Name);
      })
      .catch((err) => {})
      .finally(() => {});
  }, []);

  const handleProfileUpdate = () => {
    setLoader(true);
    axios({
      method: "PATCH",
      url: API_URL + "/update-instructor?instructor_id=" + account_id,
      headers: {
        Token: getCookie("token"),
      },
      data: {
        instructor_name: name,
        department: department,
        instructor_code: code,
      },
    })
      .then((res) => {
        console.log(res.data);
        alert("Profile Updated");
        return;
      })
      .catch((err) => {
        console.log(err);
        alert("Profile Update Failed");
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handlePasswordUpdate = () => {
    setLoader(true);
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    let data =
      oldEmail === email
        ? {
            password: newPassword,
            id: account_id,
          }
        : { email_id: email, password: newPassword, id: account_id };
    axios({
      method: "PUT",
      url: API_URL + "/update-instructor-credentials",
      headers: {
        Token: getCookie("token"),
      },
      data: data,
    })
      .then((res) => {
        console.log(res.data);
        alert("Updated Successfully");
        setUpdateCredentials(false);
        return;
      })
      .catch((err) => {
        console.log(err);
        alert("Update Failed");
        return;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      <div className="profile_page">
        <div className="profile_page_window">
          <div className="back_button">
            <Link to={`${BASE_URL}/dashboard`}>
              <img src={backButton} alt="back button" />
            </Link>
          </div>
          <div className="edit_button">
            <img
              src={editButton}
              onClick={() => {
                setEditMode(!editMode);
              }}
            />
          </div>
          <div className="profile_page_window_image">
            <p>{name.charAt(0)}</p>
          </div>
          <div
            className={`profile_page_window_details ${editMode ? "edit" : ""}`}
          >
            <input
              type="text"
              value={name}
              disabled={!editMode}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="text"
              value={department}
              disabled={!editMode}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
            />
            <input
              type="text"
              value={code}
              disabled={!editMode}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code"
            />
          </div>
          <div className={`button_container ${editMode ? "edit" : ""}`}>
            <button
              className="update_credentials_button"
              disabled={!editMode}
              onClick={() => {
                setUpdateCredentials(!updateCredentials);
              }}
            >
              Update Credentials
            </button>
            <div className="profile_page_window_submit">
              <button
                disabled={!editMode}
                onClick={() => {
                  setEditMode(false);
                  if (editMode) {
                    handleProfileUpdate();
                  }
                }}
              >
                Save
              </button>
            </div>

            <div
              className={`update_password_form ${
                updateCredentials ? "show" : ""
              }`}
            >
              <div className="update_Credentials_popup">
                <div className="email_update_form">
                  <p>Email</p>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="password_update_form">
                  <p>Password</p>
                  <div className="password_new_div">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                    />
                    <input
                      type="checkbox"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  </div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="button_forms">
                  <button
                    onClick={() => {
                      handlePasswordUpdate();
                    }}
                    className="update_button"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setUpdateCredentials(false)}
                    className="cancel_button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// TODO: IMplement old password check before updating the new password
