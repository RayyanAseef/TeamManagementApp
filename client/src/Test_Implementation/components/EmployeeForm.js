import React, { useEffect, useState } from "react";

const EmployeeForm = ({ selectedEmployee, setEditMode }) => {
  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    name: '',
    dateHired: '',
    position: ''
  });

  // Update form data when selectedEmployee changes
  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        name: selectedEmployee.name || '',
        dateHired: selectedEmployee.dateHired || '',
        position: selectedEmployee.position || ''
      });
    }
  }, [selectedEmployee]);

  

  // Handle form input changes
  const updateFormData = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const putForm = async (event) => {
    event.preventDefault();
    console.log(`${selectedEmployee.id}`)
    const response = await fetch(`/api/employees/${selectedEmployee.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })

    if (response.ok) {
        alert("Employee Updated Successfully!");
        setFormData({
          name: '',
          dateHired: '',
          position: ''
        });
        setEditMode(false);  // Optionally exit edit mode
      } else {
        alert("Failed to update employee");
      }
  }

  // Handle form submission
  const postForm = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert("Employee Added Successfully!");
      setFormData({
        name: '',
        dateHired: '',
        position: ''
      });
    } else {
      alert("Failed to add employee");
    }

    window.location.href = '/';  // Redirect after submission (use history instead for SPAs)
  };

  return (
    <div id='formDiv'>
      <form id='newEmployeeForm' onSubmit={selectedEmployee? putForm: postForm}>
        <h2>{selectedEmployee ? "Edit Employee Form" : "New Employee Form"}</h2>
        <input type='text' name='name' value={formData.name} onChange={updateFormData} required/>
        <input type='date' name='dateHired' value={formData.dateHired} onChange={updateFormData} required/>
        <select name='position' value={formData.position} onChange={updateFormData} required>
          <option value="" disabled>Select Position</option>
          <option>Engineer</option>
          <option>Manager</option>
          <option>Marketing</option>
        </select>
        <button type='submit'>{selectedEmployee? 'Edit Employee' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
