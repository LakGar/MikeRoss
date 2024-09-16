import React, { useState } from "react";
import "./ProfileComponents.css";
import authService from "../../services/authServices"; // Import service to handle API requests

const UserForm = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(
    user?.name?.split(" ").slice(1).join(" ") || ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [designation, setDesignation] = useState(user?.designation || "");
  const [address1, setAddress1] = useState(user?.address?.address1 || "");
  const [address2, setAddress2] = useState(user?.address?.address2 || "");
  const [country, setCountry] = useState(user?.address?.country || "");
  const [stateProvince, setStateProvince] = useState(
    user?.address?.state || ""
  );

  // Handle separate day, month, and year for date of birth
  const initialDate = user?.dateOfBirth
    ? new Date(user.dateOfBirth)
    : new Date();
  const [dob, setDob] = useState({
    day: initialDate.getDate() || "",
    month: initialDate.getMonth() + 1 || "", // Months are 0-indexed, so we add 1
    year: initialDate.getFullYear() || "",
  });

  // For birthdate options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleDateChange = (field, value) => {
    setDob((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine day, month, and year into a Date object
    const combinedDateOfBirth = new Date(dob.year, dob.month - 1, dob.day); // Month is 0-indexed in JS Date

    const updatedUser = {
      name: `${firstName} ${lastName}`, // Merge first and last name into the 'name' field
      email,
      phoneNumber,
      designation,
      address: {
        address1,
        address2,
        country,
        state: stateProvince,
      },
      dateOfBirth: combinedDateOfBirth, // Pass the combined date
    };

    try {
      await authService.updateUserProfile(updatedUser); // API call to update user profile
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating your profile.");
    }
  };

  return (
    <div className="UserForm">
      <p className="UserFormHeading">Personal Information</p>
      <hr className="border" />
      <div className="personalInformation">
        <div className="inputColumn">
          <div className="inputContainer">
            <p>First Name</p>
            <input
              type="text"
              id="FirstName"
              name="FirstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="inputContainer">
            <p>Last Name</p>
            <input
              type="text"
              id="LastName"
              name="LastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="inputColumn">
          <div className="inputContainer">
            <p>Email Address</p>
            <input
              type="email"
              id="UserEmail"
              name="UserEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="inputContainer">
            <p>Date of Birth</p>
            <div className="dateContainer">
              <select
                name="Month"
                id="Month"
                value={dob.month}
                onChange={(e) => handleDateChange("month", e.target.value)}
              >
                <option value="">Month</option>
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                name="Day"
                id="Day"
                value={dob.day}
                onChange={(e) => handleDateChange("day", e.target.value)}
              >
                <option value="">Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                name="Year"
                id="Year"
                value={dob.year}
                onChange={(e) => handleDateChange("year", e.target.value)}
              >
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="inputColumn">
          <div className="inputContainer">
            <p>Phone Number</p>
            <input
              type="number"
              id="PhoneNumber"
              name="PhoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="inputContainer">
            <p>Designation</p>
            <input
              type="text"
              id="Designation"
              name="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>
        </div>
      </div>

      <p className="UserFormHeading">Address</p>
      <hr className="border" />
      <div className="AddressInformation">
        <div className="inputColumn">
          <div className="inputContainer">
            <p>Address 1</p>
            <textarea
              type="text"
              id="Address1"
              name="Address1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </div>
          <div className="inputContainer">
            <p>Address 2</p>
            <textarea
              type="text"
              id="Address2"
              name="Address2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>
        </div>
        <div className="inputColumn">
          <div className="inputContainer">
            <p>Country</p>
            <input
              type="text"
              id="Country"
              name="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="inputContainer">
            <p>State/Province</p>
            <input
              type="text"
              id="StateProvince"
              name="StateProvince"
              value={stateProvince}
              onChange={(e) => setStateProvince(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div
        className="ProfileCompletionEditProfileButton"
        style={{ marginLeft: 20, marginTop: 20 }}
      >
        <button onClick={handleSubmit} className="ProfileCompletionButton">
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default UserForm;
