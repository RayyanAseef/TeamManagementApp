import { useEffect, useMemo, useState } from "react";
import loginIcon from "../Login_Icon.png";

function AuthPage({ navHeight }) {
  const queryparameters = new URLSearchParams(window.location.search);
  const [formMode, setFormMode] = useState(queryparameters.get("formMode") ? queryparameters.get("formMode") : "login");
  const [registrationPart, setRegistrationPart] = useState(0);
  const [formData, setFormData] = useState({Username: "", Password: ""});

  const dashboardHeight = useMemo(() => `calc(100vh - ${navHeight}px)`, [navHeight]);

  const postLoginForm = (event) => {
    event.preventDefault();
    window.location.href = "./dashboard";
  };

  const registrationNextPart = (event) => {
    event.preventDefault();
    // Clear name, position, and date hired fields when proceeding to the next part of registration
    setFormData({ ...formData, Name: "", Position: "", "Date Hired": "" });
    setRegistrationPart(1);
  };

  const postRegistrationForm = (event) => {
    event.preventDefault();
    window.location.href = "./dashboard";
  };

  // Define fields for login and registration forms
  const loginFields = [
    { label: "Username", type: "text" },
    { label: "Password", type: "password" }
  ];

  const registrationFields = [
    { label: "Name", type: "text" },
    { label: "Position", type: "text" },
    { label: "Date Hired", type: "date" }
  ];

  // Render form fields dynamically
  const renderFields = (fields) => {
    return fields.map((field, index) => (
      <div key={index} className="FieldContainer">
        <label className="FieldLabel">{field.label}</label>
        <input
          name={field.label}
          type={field.type}
          className="FieldInput"
          value={formData[field.label] || ""}
          onChange={updateFormData}
        />
      </div>
    ));
  };

  const updateFormData = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div id="AuthPage" style={{ height: dashboardHeight }}>
      <div id="AuthFormContainer">
        <div id="FormTitle">
          <img src={loginIcon} style={{ width: "140px" }} />
          <h1>{formMode === "login" ? "Login Form" : "Register Form"}</h1>
        </div>
        {formMode === "login" || registrationPart === 0 ? (
          <form id="AuthForm" onSubmit={formMode === "login" ? postLoginForm : registrationNextPart}>
            {renderFields(loginFields)}
            <div style={{ width: "80%", display: "flex", justifyContent: "end" }}>
              <button type="submit" id="AuthBtn">{formMode === "login" ? "LOGIN" : "Registration"}</button>
            </div>
          </form>
        ) : (
          <form id="AuthForm" onSubmit={postRegistrationForm}>
            {renderFields(registrationFields)}
            <div style={{ width: "80%", display: "flex", justifyContent: "end" }}>
              <button type="submit" id="AuthBtn">Registration</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
