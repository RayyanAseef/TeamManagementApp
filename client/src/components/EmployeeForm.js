import React, {useState} from "react";

const EmployeeForm = ({onFormSubmit}) => {
    const [formData, setFormData] = useState({
        name: '',
        dateHired: '',
        position: ''
    })

    const updateFormData = (event)=> {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    const postForm = async (event)=> {
        event.preventDefault();

        const response = await fetch('http://localhost:3001/employees', {
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
            })
            onFormSubmit();
        }

        else {
            alert("Failed to add employee")
        }
    }

    return (
        <div id='formDiv'>
        <form id='newEmployeeForm' onSubmit={postForm}>
          <h2>New Employee Form</h2>
          <input type='text' name='name' onChange={updateFormData} required/>
          <input type='date' name='dateHired' onChange={updateFormData} required/>
          <select name='position' onChange={updateFormData} defaultValue='' required>
            <option value="" disabled>
                Select Position
            </option>
            <option>Engineer</option>
            <option>Manager</option>
            <option>Marketing</option>
          </select>
          <button type='submit'>Submit</button>
        </form>
      </div>
    )
}

export default EmployeeForm;