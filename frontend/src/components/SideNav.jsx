import React, { useState } from "react";
import "./SideNav.css";
import { NavLink } from "react-router-dom";
import {
  FaFileAlt,
  FaSearch,
  FaCog,
  FaChartLine,
  FaUserShield,
  FaFileSignature,
  FaTasks,
  FaHistory,
  FaFolderOpen,
  FaTools,
} from "react-icons/fa";

const SideNav = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleNav = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`side-nav ${isCollapsed ? "collapsed" : ""}`}>
      <div className="nav-logo">
        <h1>M</h1>
        {!isCollapsed && <h2>IKE R</h2>}
        <div className="toggle-button" onClick={toggleNav}>
          {isCollapsed ? ">" : "<"}
        </div>
      </div>
      <div className="nav-links">
        <ul>
          <li>
            <NavLink to="/upload" activeClassName="active">
              <FaFileAlt />
              {!isCollapsed && <span>Document Upload</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/search" activeClassName="active">
              <FaSearch />
              {!isCollapsed && <span>Document Search</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/analysis" activeClassName="active">
              <FaFileSignature />
              {!isCollapsed && <span>Contract Analysis</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/task-management" activeClassName="active">
              <FaTasks />
              {!isCollapsed && <span>Task Management</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/audit-trail" activeClassName="active">
              <FaHistory />
              {!isCollapsed && <span>Audit Trail</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/repository" activeClassName="active">
              <FaFolderOpen />
              {!isCollapsed && <span>Document Repository</span>}
            </NavLink>
          </li>

          {/* Future components with 'Upcoming' tag */}
          <li>
            <NavLink to="/compliance-checker" activeClassName="active">
              <FaUserShield />
              {!isCollapsed && (
                <>
                  <span>Compliance Check</span>
                  <span className="upcoming-tag">Upcoming</span>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/document-tools" activeClassName="active">
              <FaTools />
              {!isCollapsed && (
                <>
                  <span>Document Tools</span>
                  <span className="upcoming-tag">Upcoming</span>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics" activeClassName="active">
              <FaChartLine />
              {!isCollapsed && (
                <>
                  <span>Analytics</span>
                  <span className="upcoming-tag">Upcoming</span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
      <NavLink to="/profile" activeClassName="profile">
        <div className="profileButton">
          <img
            className="profileImgSmall"
            src="https://plus.unsplash.com/premium_photo-1724296697228-ae418d019540?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Profile"
          />
          {!isCollapsed && (
            <>
              <div className="nameAndOccupation">
                <p className="nameSideNav">{user.name}</p>
                <p style={{ fontSize: 13 }}>{user.email}</p>
              </div>
              <div className="showprofileOptions">{">"}</div>
            </>
          )}
        </div>
      </NavLink>
    </div>
  );
};

export default SideNav;
