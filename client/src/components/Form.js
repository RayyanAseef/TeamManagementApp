import React, { useEffect, useState } from "react";

const models = {
    'Tasks': './api/tasks',
    'Requests': './api/requests',
    'Meetings': './api/meetings',
    'Workers': './api/workers',
    'Messages': './api/messages'
}

const Form = ({ model, modelName, categoryId, user }) => {
    const [formData, setFormData] = useState({}); // Start with an empty object

    // Use useEffect to initialize formData based on the model prop
    useEffect(() => {
        if (model && Object.keys(model).length > 0) {
            const initialFormData = Object.keys(model).reduce((acc, key) => {
                if (model[key].fieldKey) {
                    acc[model[key].fieldKey] = (key == 'assigner' || key == 'requestee' || key == 'creator' || key == 'from')? user.id : '';
                } else {
                    if (key != 'id') { acc[key] = '' };
                }
                return acc;
            }, {});
            setFormData(initialFormData);
        }
    }, [model]); // Re-run when the model prop changes

    // Function to format the key for label display
    const formatKey = (key) => {
        key = key.replace(/([A-Z])/g, ' $1'); // Add space before uppercase letters
        return key.charAt(0).toUpperCase() + key.slice(1); // Capitalize the first letter
    };

    const updateFormData = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const postForm = async (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log(JSON.stringify(formData))
        let response = await fetch(models[modelName], {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            alert("Successful")
        } else {
            alert("Unsuccessful")
        }
        window.location.href = `./dashboard?id=${categoryId}`
    }

    return (
        <form id="form" onSubmit={postForm}>
            <h1 style={{ textAlign: 'center' }}>{modelName} Form</h1>
            {Object.keys(formData).length > 0 ? (
                Object.keys(model).map((key) => (
                    (key !== 'id' && key !== 'assigner' && key !== 'requestee' && key !== 'creator' && key !== 'from') ? (
                        <div style={{ marginBottom: '10px' }} key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label><br />
                            {(model[key].options) ?
                                <select className="formField" id={key} name={(model[key].fieldKey) ? model[key].fieldKey : key} onChange={updateFormData} required>
                                    <option value="" disabled selected>Choose...</option>
                                    {model[key].options.map((option) => (
                                        <option key={option} value={option.id}>{option.value}</option>
                                    ))}
                                </select>
                                :
                                <input className="formField" id={key} name={key} required
                                    type={model[key].type === 'dateonly' ? 'date' : model[key].type === 'date' ? 'datetime-local' : model[key].type}
                                    onChange={updateFormData}
                                />
                            }
                        </div>
                    ) : null
                ))
            ) : (
                <p>Loading...</p> // Display a loading message while waiting for model to load
            )}
            <button type="submit">Submit</button>
        </form>
    );
};

export default Form;
