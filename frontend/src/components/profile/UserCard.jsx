import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import "./ProfileComponents.css";

const UserCard = ({ user }) => {
  return (
    <div className="container">
      <MoreVertIcon className="option-button" />

      <div className="topComponent">
        <img
          className="profileImg"
          src="https://plus.unsplash.com/premium_photo-1724296697228-ae418d019540?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <h4 className="name">{user.name}</h4>
        <p>{user.email}</p>
        <div className="social">
          <a href="#">
            <LinkedInIcon />
          </a>
          <a href="#">
            <FacebookIcon />
          </a>
          <a href="#">
            <TwitterIcon />
          </a>
        </div>
      </div>
      <div className="middleComponent">
        <div className="stat borderRight">
          <p1>
            <b>25</b>
          </p1>
          <p>Documents</p>
        </div>
        <div className="stat">
          <p1>
            <b>50</b>
          </p1>
          <p>Projects</p>
        </div>
      </div>
      <div className="bottomComponent">
        <div className="button">
          <PersonIcon />
          <span>Edit Profile</span>
        </div>
        <div className="button">
          <PaymentIcon />
          <span>Payment Settings</span>
        </div>
        <div className="button">
          <SettingsIcon />
          <span>Account Settings</span>
        </div>
        <div className="button">
          <LockIcon />
          <span>Change Password</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
