import React from "react";
import "./ProfileCard.css";
import { useAuth } from "../../contexts/AuthContext";

const ProfileCard = ({ avatar, name, description }) => {
  const { user, loading } = useAuth();

  // Mapping nhóm từ MaNhom
  const groupMap = {
    "GR001": "Nhóm Quản trị",
    "GR002": "Bác sĩ",
    "GR003": "Y tá",
    "GR004": "Lễ tân",
    "ADMIN": "Quản trị viên",
  };

  // Loading state
  if (loading) {
    return (
      <div className="profile-card">
        <div className="profile-info">
          <h3 className="profile-name">Đang tải...</h3>
        </div>
      </div>
    );
  }

  // Null safety
  const displayName = user?.TenDangNhap || name || "UserName";
  // Ưu tiên TenNhom từ backend, nếu không có thì dùng mapping
  const displayDesc = user?.TenNhom || groupMap[user?.MaNhom] || description || "User Group";

  return (
    <div className="profile-card">
      <img 
        src={avatar || "./aeri.png"} 
        alt="User Avatar" 
        className="profile-avatar" 
      />
      <div className="profile-info">
        <h3 className="profile-name">{displayName}</h3>
        <p className="profile-desc">{displayDesc}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
