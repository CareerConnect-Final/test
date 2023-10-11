import React from "react";
import { useContext, useState } from "react";
import { Route, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth/authContext";
import cookie from "react-cookies";

const PrivateRoute = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const cookieToken = cookie.load("auth");

  const [Token, setToken] = useState(cookieToken);
  // console.log(Token);
  const navigate = useNavigate();
  if (cookieToken === "null") {
    navigate("/login");
  }

  return <></>;
};

export default PrivateRoute;
