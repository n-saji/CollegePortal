import axios from "axios";
import { API_URL } from "../config/config.jsx";

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export async function validateCookie(token) {
  try {
    const res = await axios.get(API_URL + "/check-token-status", {
      headers: { Token: token },
    });
    if (res.status === 200) return true;
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export default getCookie;
