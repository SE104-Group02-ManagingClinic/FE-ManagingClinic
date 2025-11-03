import React from "react";
import "./Ticket.css";
import { FaUser, FaVenusMars, FaBirthdayCake } from "react-icons/fa";

const PatientTicket = ({ name, gender, age }) => {
  return (
    <div className="overview-card">
      <div className="overview-content">
        <div>
          <div className="overview-title">{name}</div>
          <div className="overview-sub">
            <FaVenusMars style={{ marginRight: 6 }} />
            {gender} | {age} tuổi
          </div>
        </div>
        <div className="overview-icon">
          <FaUser />
        </div>
      </div>
    </div>  
  );
};

export default PatientTicket;
