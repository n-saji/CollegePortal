import axios from "axios";
import { API_URL } from "../config/config.jsx";

export const GetUserName = (c_account_id,c_Token) => {
  axios({
    method: "GET",
    url: API_URL + "/get-instructor-name-by-id/" + c_account_id,
    headers: {
      Token: c_Token,
    },
  })
    .then((res) => {
      console.log(res);
      localStorage.setItem("username", res.data.instructor_name);
    })
    .catch((err) => {
      console.log(err);
      alert("Session expired. Please login again");
    })
};
