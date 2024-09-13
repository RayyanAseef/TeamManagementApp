import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';

function Home() {
  const [id, setId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Fetch employees from the API
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch("/api/employees");
      const json = await res.json();
      setEmployees(json);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees, editMode]);

  // Find selected employee when `id` changes
  useEffect(() => {
    if (id) {
      const employee = employees.find((emp) => emp.id === id);
      setSelectedEmployee(employee || null); // Ensure employee is set to null if not found
    }
  }, [id, employees]);

  const handleDelete = useCallback(async (id, event) => {
    event.stopPropagation();
    try {
      await fetch(`/api/employees/delete/${id}`, { method: 'DELETE' });
      // Fetch the updated employee list after deletion
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  }, [fetchEmployees]);

  const handleEdit = useCallback((event) => {
    event.stopPropagation();
    setEditMode((prevMode) => !prevMode);
  }, []);

  return (
    <div>
      {id ? <h1>Selected Employee Id: {id}</h1> : <h1>Employees</h1>}
      <div id="employees">
        {id && selectedEmployee ? (
          editMode ? (
            <EmployeeForm 
              selectedEmployee={selectedEmployee} 
              setEditMode={setEditMode}
            />
          ) : (
            <div
              className="employeeDetails"
              id={selectedEmployee.id}
              onClick={() => setId(null)}
            >
              <p>Name: {selectedEmployee?.name}</p>
              <p>Date Hired: {selectedEmployee?.dateHired}</p>
              <p>Position: {selectedEmployee?.position}</p>
              <button onClick={(event) => handleEdit(event)}>
                Edit Employee
              </button>
            </div>
          )
        ) : (
          employees.map((employee) => (
            <div
              key={employee.id}
              className="employeeDetails"
              id={employee.id}
              onClick={() => setId(employee.id)}
            >
              <p>Name: {employee.name}</p>
              <p>Date Hired: {employee.dateHired}</p>
              <p>Position: {employee.position}</p>
              <button onClick={(event) => handleDelete(employee.id, event)}>
                Delete Employee
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
