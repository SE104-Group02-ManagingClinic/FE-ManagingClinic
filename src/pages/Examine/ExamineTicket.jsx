import React from "react";
import "./Ticket.css";
import { FaNotesMedical, FaCalendarAlt } from "react-icons/fa";

const ExamineTicket = ({ name, disease, date }) => {
  return (
    <div className="overview-card">
      <div className="overview-content">
        <div>
          <div className="overview-title">{name}</div>
          <div className="overview-sub">
            <FaNotesMedical style={{ marginRight: 6 }} />
            {disease}
          </div>
          <div className="overview-sub">
            <FaCalendarAlt style={{ marginRight: 6 }} />
            {date}
          </div>
        </div>
        <div className="overview-icon">
          <FaNotesMedical />
        </div>
      </div>
    </div>
  );
};

export default ExamineTicket;
