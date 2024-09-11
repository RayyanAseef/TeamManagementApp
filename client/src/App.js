import './App.css';
import {useEffect, useState} from  'react';
import EmployeeForm from './components/EmployeeForm';
 
function App() {

  const [employees, setEmployees] = useState([])
  const [formUpdated, setFormUpdated] = useState(false)

  useEffect(()=>{
    fetch("http://localhost:3001/employees")
        .then((res) => res.json())
        .then((json) => {setEmployees(json);})

      return () => {
        setFormUpdated(false)
      }
  }, [formUpdated]);

  const updateFormData = ()=> {
    setFormUpdated(true);
  }

  const handleDelete = (id)=> {
    console.log(id);
    updateFormData();
  }

  return (
    <div className="App">
      <h1>Employees</h1>
      <div id='employees'>
      {employees.map( (employee) => (
        <div className='employeeDetails' id={employee.id}>
          <p>Name: {employee.name}</p>
          <p>Date Hired: {employee.dateHired}</p>
          <p>Position: {employee.position}</p>
          <button onClick={()=> handleDelete(employee.id)}>Delete Employee</button>
        </div>
      ))}
      </div>
      <EmployeeForm onFormSubmit={updateFormData}/>
    </div>
  );
}

export default App;
