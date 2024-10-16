import { useEffect, useMemo, useState } from "react";
import loginIcon from "../Login_Icon.png";

function AuthPage({ navHeight }) {
  const queryparameters = new URLSearchParams(window.location.search);
  const [formMode, setFormMode] = useState(queryparameters.get("formMode") ? queryparameters.get("formMode") : "login");
  const [registrationPart, setRegistrationPart] = useState(0);
  const [formData, setFormData] = useState({ Username: "", Password: "" });
  const [buttonPressed, setButtonPressed] = useState(""); // State to store which button was pressed

  const dashboardHeight = useMemo(() => `calc(100vh - ${navHeight}px)`, [navHeight]);

  const postLoginForm = async (event) => {
    event.preventDefault();
    let response = await fetch("/api/useridentification/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    let json = await response.json();

    if (json.auth) {
      window.location.href = "./dashboard";
    } else {
      setFormData({
        Username: "",
        Password: "",
      });
      alert(json.message);
    }
  };

  const registrationNextPart = (event) => {
    event.preventDefault();
    setFormData({ ...formData, Name: "", Position: "", "Date Hired": "" });
    setRegistrationPart(1);
  };

  const postRegistrationForm = async (event) => {
    event.preventDefault();
    
    if (buttonPressed === "back") {
      setRegistrationPart(0);
    } else if (buttonPressed === "register") {
      const response = await fetch("/api/useridentification/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();
      if (json.message === "User registered successfully") {
        window.location.href = "./dashboard";
      } else {
        alert(json.message);
        setFormData({});
        setRegistrationPart(0);
      }
    }
  };

  // Define fields for login and registration forms
  const loginFields = [
    { label: "Username", type: "text" },
    { label: "Password", type: "password" },
  ];

  const registrationFields = [
    { label: "Name", type: "text" },
    { label: "Position", type: "text" },
    { label: "Date Hired", type: "date" },
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
              <button type="submit" id="AuthBtn">
                {formMode === "login" ? "LOGIN" : "NEXT"}
              </button>
            </div>
          </form>
        ) : (
          <form id="AuthForm" onSubmit={postRegistrationForm}>
            {renderFields(registrationFields)}
            <div style={{ width: "80%", display: "flex", justifyContent: "space-between" }}>
              <button type="submit" id="AuthBtn" name="back" onClick={() => setButtonPressed("back")}>
                BACK
              </button>
              <button type="submit" id="AuthBtn" name="register" onClick={() => setButtonPressed("register")}>
                REGISTER
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthPage;