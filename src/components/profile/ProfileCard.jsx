import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ avatar, name, description }) => {
  return (
    <div className="profile-card">
      <img 
        src={avatar || "./aeri.png"} 
        alt="User Avatar" 
        className="profile-avatar" 
      />
      <div className="profile-info">
        <h3 className="profile-name">{name || "UserName"}</h3>
        <p className="profile-desc">{description || "UserDescription"}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
