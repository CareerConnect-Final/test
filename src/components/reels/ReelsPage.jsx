// src/components/ReelsPage.js

import React, { useEffect, useState, useContext, useRef } from "react";
import "./reel.scss";
import { StateContext } from "../../context/state";
import { AuthContext } from "../../context/auth/authContext";
import cookie from "react-cookies";

import Reel from "./Reel";
import ShareReels from './ShareReels';

const ReelsPage = () => {
  const user = cookie.load("user");
  const authToken = cookie.load("auth");

  const state = useContext(StateContext);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  console.log("state==>", state);
  console.log("state.reels==>", state.reels);

  useEffect(() => {
    state.reel;
  }, []);
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      <div className="App">
        <center>
          {/* <ShareReels/> */}
          <h3></h3> 
          {/* Reels Page */}

          <div className="video-container" id="video-container">
            {state.reels.map((list, i) => (
              <Reel
                key={i}
                url={list.video}
                username={list.username}
                profilePicture={list.profilePicture}
                reelId={list.id}
              />
            ))}
          </div>
        </center>
      </div>
    </>
  );
};

export default ReelsPage;
