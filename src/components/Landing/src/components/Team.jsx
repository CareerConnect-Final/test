import React from 'react';
import { cardsData } from '../data/data.json'; 
import 'font-awesome/css/font-awesome.min.css';
import './TeamCard.css'; 

export const Teams = (props) => {
  
  return (
    <div id='team' className='text-center'>
      <div className='container'>
        <div className='col-md-8 col-md-offset-2 section-title'>
          <h2>Meet the Team</h2>
          <p>
          We are a team of passionate individuals graduated from ASAC.
          </p>
        </div>
        <div id='row' >
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className='col-md-3 col-sm-6 team' style={{width:"20%", display: "flex" , justifyContent: "center"}}>
                  <div className='thumbnail'>
                    {' '}
                    <img src={d.img} alt='...' className='team-img' />
                    <div className='caption'>
                      <h4>{d.name}</h4>
                      <p>{d.job}</p>
                    </div>
                  </div>
                </div>
              ))
            : null }
        </div>
        {cardsData.map((card, index) => (
          <div key={index} className='col-md-3 col-sm-6 team' style={{width:"20%", display: "flex"}}>
            <div className='thumbnail'>
              <img src={card.img} alt='...' className='team-img' />
              <div className='caption'>
                <h4>{card.name}</h4>
                <p>{card.job}</p>
                <div className="social-links">
  <a href={card.github} target="_blank" rel="noopener noreferrer">
    <i className={card.icon}></i>
  </a>
  <a href={card.linkedin} target="_blank" rel="noopener noreferrer">
    <i className={card.icon1}></i>
  </a>
  <a href={card.gmail} target="_blank" rel="noopener noreferrer">
    <i className={card.icon2}></i>
  </a>
</div>



              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
