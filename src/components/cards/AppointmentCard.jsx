import React from "react";
import "./AppointmentCard.css";

const AppointmentCard = ({ patient, disease, date, time }) => {
  return (
    <div className="appointment-card">

      <div className="info">
      <div className = "key">
        <p>Người bệnh:</p>
        <p>Loại bệnh:</p>
      </div>
      <div className = "value">
        <p>{patient}</p>
        <p>{disease}</p>
      </div>
      </div>
      <p>{date}</p>
      <p>{time}</p>
      <button className="detail-btn">Chi tiết</button>
    </div>
  );
};

export default AppointmentCard;
