// import { useEffect, useState } from "react";
// import "./landingPage.css";
// import axios from "axios";
// import { API_URL, BASE_URL } from "../../config/config.jsx";
// import { Link } from "react-router-dom";
// import { getCookie, validateCookie } from "../../utils/cookies";
// import { GetUserName } from "../../utils/helper";
// const LandingPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [greeting, setGreeting] = useState("");
//   const [loginStatus, setLoginStatus] = useState(false);

//   useEffect(() => {
//     document.title = "University Portal";
//   }, []);

//   const updateTitle = () => {
//     const c_Token = getCookie("token");
//     const c_account_id = getCookie("account_id");
//     console.log(c_Token, c_account_id);

//     if (!c_account_id || !c_Token) {
//       return;
//     }

//     try {
//       GetUserName(c_account_id, c_Token);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     const checkTokenStatus = async () => {
//       try {
//         if (!getCookie("token")) {
//           return;
//         }
//         await validateCookie(getCookie("token"))
//           .then((res) => {
//             if (res) {
//               setLoginStatus(true);
//               return <Link to={`${BASE_URL}/dashboard`} />;
//             }
//           })
//           .catch((err) => {
//             console.error(err);
//           });
//       } catch (err) {
//         console.error(err);
//         return;
//       }
//     };

//     checkTokenStatus();

//     const interval = setInterval(() => {
//       checkTokenStatus();
//     }, 5 * 60 * 1000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const date = new Date();
//     const hour = date.getHours();

//     if (hour >= 0 && hour < 12) {
//       setGreeting("Morning");
//     } else if (hour >= 12 && hour < 17) {
//       setGreeting("Afternoon");
//     } else {
//       setGreeting("Evening");
//     }
//   });

//   const handleLogin = () => {
//     if (email === "" || password === "") {
//       alert("Please enter email and password");
//     } else {
//       axios({
//         method: "POST",
//         url: API_URL + "/v1/login",
//         data: {
//           email_id: email,
//           password: password,
//         },
//       })
//         .then((res) => {
//           document.cookie = `token=${res.headers["token"]}`;
//           document.cookie = `account_id=${res.headers["account_id"]}`;
//           setLoginStatus(true);
//           console.log(res.headers["token"]);
//         })
//         .catch((err) => {
//           console.log(err);
//           if (err.status !== 200) {
//             alert(err.response.data);
//             return;
//           }

//           alert("Something went wrong");
//         });
//     }
//   };

//   const handleShowPassword = () => {
//     if (showPassword === false) {
//       setShowPassword(true);
//     } else {
//       setShowPassword(false);
//     }
//   };

//   if (loginStatus) {
//     console.log(getCookie("token"));
//     updateTitle();
//     return <Link to={`${BASE_URL}/dashboard`} />;
//   }

//   return (
//     <>
//       <div className="landing_page">
//         <div className="landing_page_window">
//           <div className="landing_page_window_title">
//             <h1>Good {greeting}</h1>
//             <h2>Please Login</h2>
//           </div>

//           <div className="landing_page_window_form">
//             <div className="form_email">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                 }}
//               />
//             </div>
//             <div className="form_password">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                 }}
//               />
//             </div>
//             <div className="form_checkbox_password">
//               <input type="checkbox" onClick={handleShowPassword} />
//               <label>Show Password</label>
//             </div>
//             <div className="form_submit">
//               <button
//                 onClick={() => {
//                   console.log(handleLogin);
//                   return;
//                 }}
//               >
//                 Login
//               </button>
//               <button>Sign Up</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

export default LandingPage;
