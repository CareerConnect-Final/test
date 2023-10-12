import React, { useState, useEffect } from "react";
import "./Alert.scss";
const Alert = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 4000); // 3000 milliseconds (3 seconds)
    return () => clearTimeout(timeout);
  }, []);
  return <>{isVisible && <div className="alert">{message}</div>}</>;
};
export default Alert;
