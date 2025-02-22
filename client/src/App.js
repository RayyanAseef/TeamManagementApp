import './App.css';
// import Home from './Test_Implementation/pages/Home';
// import EmployeeFormPage from './Test_Implementation/pages/EmployeeFormPage';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProtectedRoute from './Middleware/ProtectedRoute';

function App() {
  const [navHeight, setNavHeight] = useState(0)

  useEffect( ()=> {
    const nav = document.getElementById('nav');
    setNavHeight(nav.offsetHeight);
  }, [])

  return (
    <Router>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <div style={{minHeight: '100vh'}}>
          <NavBar/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} navHeight={navHeight}/>} />
            <Route path="/auth" element={<AuthPage navHeight={navHeight}/>} />
          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App; 
