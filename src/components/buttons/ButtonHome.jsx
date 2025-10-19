import React from "react";
import "./ButtonHome.css";
const ButtonHome = ({ label, onClick }) => {
    return (
        <div className="button-home">
            <button className="button" onClick={onClick}>
                {label}
            </button>
            <div className="indicator-button">
            </div>
        </div>
    );
}
export default ButtonHome;