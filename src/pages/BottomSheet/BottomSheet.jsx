import React, { useRef, useEffect } from "react";
import "./BottomSheet.css";

/**
 * BottomSheet with built-in drag-to-close + bounce animation + fixes for reopen bug.
 *
 * Props:
 *  - isOpen (bool)
 *  - onClose (fn)
 *  - children
 */
const BottomSheet = ({ children, isOpen, onClose }) => {
  const contentRef = useRef(null);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const closeTimeoutRef = useRef(null);

  const THRESHOLD = 200; // px để đóng
  const CLOSE_ANIM_MS = 300;

  useEffect(() => {
    const sheet = contentRef.current;
    if (!sheet) return;

    const handleStart = (e) => {
      // chỉ kích hoạt nếu sheet đang mở
      if (!isOpen) return;

      draggingRef.current = true;
      startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
      currentYRef.current = 0;
      // tắt transition để kéo mượt
      sheet.style.transition = "none";
    };

    const handleMove = (e) => {
      if (!draggingRef.current) return;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const diff = y - startYRef.current;
      if (diff > 0) {
        currentYRef.current = diff;
        sheet.style.transform = `translateY(${diff}px)`;
      }
    };

    const handleEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      const diff = currentYRef.current;
      // dùng easing "bật nhẹ" khi bật về (overshoot-like) nếu chưa đóng
      if (diff > THRESHOLD) {
        // đóng: trượt xuống hẳn rồi gọi onClose
        sheet.style.transition = `transform ${CLOSE_ANIM_MS}ms cubic-bezier(0.25, 0.8, 0.25, 1)`;
        sheet.style.transform = "translateY(100%)";

        // dọn dẹp và gọi onClose sau animation
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(() => {
          // gọi callback đóng (parent sẽ set isOpen=false)
          onClose?.();

          // xóa inline style sau khi parent có thể đã thay đổi class để tránh override css khi mở lại
          // dùng setTimeout nhỏ để đảm bảo thông suốt render cycle
          setTimeout(() => {
            if (sheet) {
              sheet.style.transition = "";
              sheet.style.transform = "";
            }
          }, 20);
        }, CLOSE_ANIM_MS);
      } else {
        // bật trở lại với "springy" easing
        sheet.style.transition = "transform 500ms cubic-bezier(0.2, 1.5, 0.5, 1)";
        sheet.style.transform = "translateY(0)";

        // sau khi animation bounce kết thúc, dọn transition inline để CSS quản lý nếu cần
        setTimeout(() => {
          if (sheet) {
            sheet.style.transition = "";
            sheet.style.transform = "";
          }
        }, 520);
      }

      // reset
      currentYRef.current = 0;
    };

    // event listeners
    sheet.addEventListener("mousedown", handleStart);
    sheet.addEventListener("mousemove", handleMove);
    sheet.addEventListener("mouseup", handleEnd);
    sheet.addEventListener("mouseleave", handleEnd);
    sheet.addEventListener("touchstart", handleStart);
    sheet.addEventListener("touchmove", handleMove, { passive: false });
    sheet.addEventListener("touchend", handleEnd);

    return () => {
      sheet.removeEventListener("mousedown", handleStart);
      sheet.removeEventListener("mousemove", handleMove);
      sheet.removeEventListener("mouseup", handleEnd);
      sheet.removeEventListener("mouseleave", handleEnd);
      sheet.removeEventListener("touchstart", handleStart);
      sheet.removeEventListener("touchmove", handleMove);
      sheet.removeEventListener("touchend", handleEnd);
      clearTimeout(closeTimeoutRef.current);
    };
  }, [isOpen, onClose]);

  // Khi isOpen thay đổi thành true, xóa inline styles (nếu còn) để CSS .open xử lý transition bình thường.
  // Điều này là cần thiết nếu trước đó ta đã set inline transform = translateY(100%) khi đóng bằng kéo.
  useEffect(() => {
    const sheet = contentRef.current;
    if (!sheet) return;

    if (isOpen) {
      // clear inline override để CSS có thể animate từ translateY(100%) -> 0 (theo class .open)
      sheet.style.transition = "";
      sheet.style.transform = "";
      // đôi khi trình duyệt cần reflow để transition CSS chạy sạch — force reflow
      // eslint-disable-next-line no-unused-expressions
      sheet.offsetHeight; // access to force reflow
    } else {
      // khi isOpen=false, không làm gì đặc biệt: CSS sẽ áp translateY(100%).
      // vẫn xóa transition inline để đảm bảo behavior nhất quán.
      sheet.style.transition = "";
    }
  }, [isOpen]);

  return (
    <div className={`bottomsheet ${isOpen ? "open" : ""}`}>
      <div className="overlay" onClick={onClose} />
      <div className="content" ref={contentRef}>
        <div className="dragbutton" />
        <div className="body">{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
