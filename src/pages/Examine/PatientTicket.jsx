import React from "react";
import "./Ticket.css";
import { FaUser, FaVenusMars, FaBirthdayCake, FaClock } from "react-icons/fa";

const PatientTicket = ({ patient, name, gender, age, isPending, onClick }) => {
    // Format ngày sinh từ ISO string (e.g., "1990-05-20" hoặc "1990-05-20T00:00:00.000Z")
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div 
            className={`overview-card ${isPending ? 'pending' : ''}`} 
            onClick={onClick} 
            style={{ cursor: "pointer" }}
        >
            <div className="overview-content">
                <div>
                    <div className="overview-title">
                        {name}
                        {isPending && (
                            <span className="pending-tag">
                                <FaClock style={{ marginRight: 4 }} />
                                Chờ lưu
                            </span>
                        )}
                    </div>
                    <div className="overview-sub">
                        <FaVenusMars style={{ marginRight: 6 }} />
                        {gender} | Sinh: {formatDate(age)}
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
