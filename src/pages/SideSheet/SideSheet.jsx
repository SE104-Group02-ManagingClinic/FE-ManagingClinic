import React, { useRef, useEffect } from "react";
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
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const closeTimeoutRef = useRef(null);

  const THRESHOLD = 100; // px để đóng (kéo từ phải sang trái)
  const CLOSE_ANIM_MS = 300;

  useEffect(() => {
    const sheet = contentRef.current;
    if (!sheet) return;

    const handleStart = (e) => {
      if (!isOpen) return;

      draggingRef.current = true;
      startXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
      currentXRef.current = 0;
      sheet.style.transition = "none";
    };

    const handleMove = (e) => {
      if (!draggingRef.current) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const diff = startXRef.current - x; // Kéo từ phải sang trái = giá trị dương
      if (diff > 0) {
        currentXRef.current = diff;
        sheet.style.transform = `translateX(${diff}px)`;
      }
    };

    const handleEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      const diff = currentXRef.current;
      if (diff > THRESHOLD) {
        // Đóng: trượt sang phải hẳn
        sheet.style.transition = `transform ${CLOSE_ANIM_MS}ms cubic-bezier(0.25, 0.8, 0.25, 1)`;
        sheet.style.transform = "translateX(100%)";

        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(() => {
          onClose?.();

          setTimeout(() => {
            if (sheet) {
              sheet.style.transition = "";
              sheet.style.transform = "";
            }
          }, 20);
        }, CLOSE_ANIM_MS);
      } else {
        // Bật trở lại với springy easing
        sheet.style.transition = "transform 500ms cubic-bezier(0.2, 1.5, 0.5, 1)";
        sheet.style.transform = "translateX(0)";

        setTimeout(() => {
          if (sheet) {
            sheet.style.transition = "";
          }
        }, 500);
      }
    };

    const sheet_element = sheet;
    sheet_element.addEventListener("touchstart", handleStart, false);
    sheet_element.addEventListener("touchmove", handleMove, false);
    sheet_element.addEventListener("touchend", handleEnd, false);
    sheet_element.addEventListener("mousedown", handleStart, false);
    sheet_element.addEventListener("mousemove", handleMove, false);
    sheet_element.addEventListener("mouseup", handleEnd, false);

    return () => {
      sheet_element.removeEventListener("touchstart", handleStart, false);
      sheet_element.removeEventListener("touchmove", handleMove, false);
      sheet_element.removeEventListener("touchend", handleEnd, false);
      sheet_element.removeEventListener("mousedown", handleStart, false);
      sheet_element.removeEventListener("mousemove", handleMove, false);
      sheet_element.removeEventListener("mouseup", handleEnd, false);
      clearTimeout(closeTimeoutRef.current);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`sidesheet ${isOpen ? "open" : ""}`}>
      {/* Overlay */}
      <div className="overlay" onClick={onClose}></div>

      {/* Sheet content */}
      <div className="content" ref={contentRef}>
        <div className="dragbutton"></div>
        {children}
      </div>
    </div>
  );
};

export default SideSheet;
