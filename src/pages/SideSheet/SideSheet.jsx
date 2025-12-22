import React, { useRef } from "react";
import "./SideSheet.css";

/**
 * SideSheet component - hiển thị từ bên phải
 * Props:
 *  - isOpen (bool)
 *  - onClose (fn)
 *  - children
 */
const SideSheet = ({ children, isOpen, onClose }) => {
  const contentRef = useRef(null);

  return (
    <div className={`sidesheet ${isOpen ? "open" : ""}`}>
      {/* Overlay */}
      <div className="overlay" onClick={onClose}></div>

      {/* Sheet content */}
      <div 
        className="content" 
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default SideSheet;
