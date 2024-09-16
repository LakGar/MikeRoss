import React, { useEffect, useState } from "react";
import UserCard from "../components/profile/UserCard";
import UserForm from "../components/profile/USerForm"; // Corrected casing
import "./Profile.css"; // Separate CSS file
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import ProfileCompletion from "../components/profile/ProfileCompletion";
import authService from "../services/authServices"; // Import the authService to fetch the user data

const Profile = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await authService.getUserProfile(); // Fetch the user data
        setUser(userData); // Set the user data
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchUserProfile(); // Trigger the fetch when the component mounts
  }, []);

  // Show a loading indicator while fetching the data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="screen">
      <div className="left">
        <SideNav user={user} />
      </div>
      <div className="right">
        <div className="top">
          <TopNav user={user} />
          <ProfileCompletion user={user} />
        </div>
        <div className="main">
          {/* Pass the user data as props to UserCard and UserForm */}
          <UserCard user={user} />
          <UserForm user={user} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
