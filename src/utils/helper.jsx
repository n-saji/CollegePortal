import axios from "axios";
import { API_URL } from "../config/config.jsx";

export const GetUserName = async (c_account_id, c_Token) => {
  await axios({
    method: "GET",
    url: API_URL + "/get-instructor-name-by-id/" + c_account_id,
    headers: {
      token: c_Token,
    },
  })
    .then((res) => {
      localStorage.setItem("username", res.data.instructor_name);
    })
    .catch((err) => {
      console.log(err);
      
    });
};
