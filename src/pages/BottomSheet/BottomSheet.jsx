import React from "react";
import "./BottomSheet.css";

const BottomSheet = ({ children, isOpen, onClose }) => {
    return (
        <div className={`bottomsheet ${isOpen ? "open" : ""}`}>
            <div className="overlay" onClick={onClose}></div>
            <div className="content">
                <div className="dragbutton"></div>
                <div className="body">{children}</div>
            </div>
        </div>
    );
};

export default BottomSheet;
