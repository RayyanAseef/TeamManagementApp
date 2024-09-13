import './App.css';
// import Home from './Test_Implementation/pages/Home';
// import EmployeeFormPage from './Test_Implementation/pages/EmployeeFormPage';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Router>
        <Routes>
          <Route path='/' Component={Home}></Route>
        </Routes>
      </Router>
      <Footer/>
    </div>
  );
}

export default App; 
