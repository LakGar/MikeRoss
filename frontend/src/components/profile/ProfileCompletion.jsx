import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the elements with ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

const ProfileCompletion = ({ user }) => {
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Fields that are considered for profile completion
  const fields = [
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.phoneNumber,
    user?.address?.address1,
    user?.address?.country,
    user?.address?.state,
    user?.dateOfBirth, // Consider this only if date of birth is set
  ];

  // Calculate completion percentage
  useEffect(() => {
    const filledFields = fields.filter(Boolean).length; // Count non-empty fields
    const totalFields = fields.length;
    const completion = Math.floor((filledFields / totalFields) * 100);
    setCompletionPercentage(completion);
  }, [user]);

  const data = {
    datasets: [
      {
        data: [completionPercentage, 100 - completionPercentage], // Dynamic completion
        backgroundColor: ["#4caf50", "#e0e0e0"], // Green for completion, grey for remaining
        borderWidth: 0, // No borders around the sections
      },
    ],
  };

  const options = {
    cutout: "90%", // Creates the hole in the middle (donut chart)
    plugins: {
      tooltip: {
        enabled: false, // Disable tooltip
      },
    },
  };

  return (
    <div
      className="ProfileCompletionContainer"
      style={{ textAlign: "center", marginLeft: 20, marginRight: 20 }}
    >
      <div
        className="completionPie"
        style={{
          position: "relative",
          width: "100px",
          height: "100px",
          margin: "0 auto",
        }}
      >
        <Doughnut data={data} options={options} />
        <div
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "20px",
          }}
        >
          {completionPercentage}%
        </div>
      </div>

      <div className="ProfileCompletionMiddle">
        <p className="mainText">Edit Your Profile</p>
        <p className="subText">Complete your profile to unlock all features</p>
      </div>

      <div className="ProfileCompletionEditProfileButton">
        <button
          onClick={() => alert("Edit Profile clicked")}
          className="ProfileCompletionButton"
        >
          Edit Your Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCompletion;
