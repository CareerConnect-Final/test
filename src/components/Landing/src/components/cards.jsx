import React from 'react';
import './TeamCard.css'; 

const TeamCard = () => {
    const teamGridStyle = {
        display: 'grid',
        gridTemplateColumns: '32.33% 32.33% 32.33%',
        columnGap: '1.5%',
        marginTop: '100px',
      };
    
      const avatarStyle = {
        position: 'absolute',
        left: '0',
        right: '0',
        top: '-80px',
        textAlign: 'center',
      };
  return (
    <div className="teamWrapper">
      <div className="container">
        <h1 align="center">Our Team</h1>
        <p align="center">We are a team of passionate individuals graduated from ASAC.</p>
        <div className="teamGrid">
          {/* Repeat the following block for each team member */}
          <div className="column">
            <div className="teamCol">
              <div className="teamColInner">
                <div className="avatar">
                  <img
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjxivAs4UknzmDfLBXGMxQkayiZDhR2ftB4jcIV7LEnIEStiUyMygioZnbLXCAND-I_xWQpVp0jv-dv9NVNbuKn4sNpXYtLIJk2-IOdWQNpC2Ldapnljifu0pnQqAWU848Ja4lT9ugQex-nwECEh3a96GXwiRXlnGEE6FFF_tKm66IGe3fzmLaVIoNL/s1600/img_avatar.png"
                    alt="Member"
                  />
                </div>
                <div className="memberName">
                  <h2 align="center">Mohamed Yousef</h2>
                </div>
                <div className="memberInfo">
                  <p align="center">
                    Lorem Ipsum is a simply dummy text of the printing and
                    typesetting industry.
                  </p>
                </div>
                <div className="memberMail">
                  <p align="center">
                    <a href="mailto:@gmail.com">mailto:@gmail.com</a>
                  </p>
                </div>
                <div className="memberSocial">
                  <ul className="socialListing">
                    <li>
                      <a href="#">
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* End of team member block */}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
