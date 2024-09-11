import './App.css';
import Home from './pages/Home';
import EmployeeFormPage from './pages/EmployeeFormPage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
 
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' Component={Home}></Route>
          <Route path='/form' Component={EmployeeFormPage}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App; 
