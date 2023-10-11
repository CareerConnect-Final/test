import axios from "axios";
import { useContext } from "react";
import "./gallery.scss";
import { AuthContext } from "../../context/auth/authContext";
import { StateContext } from "../../context/state";
import { useState } from "react";
import cookie from "react-cookies";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Gallery = () => {
  return (
    <>
      <Navbar className="my-navbar" data-bs-theme="dark">
        <Container>
          <Navbar.Brand className="gallery-container" href="#Gallery">
            Gallery
          </Navbar.Brand>
          <Nav className="nav-links me-auto">
            <Nav.Link href="#profile">profile</Nav.Link>
            <Nav.Link href="#cover">cover</Nav.Link>
            <Nav.Link href="#post">post's</Nav.Link>
            <Nav.Link href="#Reel">Reel's</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* <div className="my-navbar">
        <span >
            <div className="center-container">
          <button className="gallery-container" href="#Gallery">
            Gallery
          </button>
          </div>

          <div className="nav-links">
            <button>profile</button>
            <button>cover</button>
            <button>post's</button>
            <button>Reel's</button>
          </div>
        </span>
      </div> */}
    </>
  );
};

export default Gallery;
