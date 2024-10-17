import { useEffect, useState } from 'react';
import Form from './Form'
import { useLocation } from 'react-router-dom';

const categoryURLs = {
    1: '/api/models/Tasks', 
    2: '/api/models/Requests', 
    3: '/api/models/Meetings', 
    4: '/api/models/Workers', 
    5: '/api/models/Messages', 
};

const NavBar = () => {
    const [formId, setFormId] = useState(0)
    const [model, setModel] = useState({})
    const [cachedData, setCachedData] = useState({})
    const [user, setUser] = useState(null)

    // Use useLocation to get the current page URL
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(()=> {
        const fetchData = async () => {
            if (formId === 0) { return }
            if (cachedData[formId]) {
                setModel(cachedData[formId])
            } else {
                const res = await fetch(categoryURLs[formId]);
                const json = await res.json();

                setModel(json)
                setCachedData((prevData) => ({ ...prevData, [formId]: json}))
            }
        }

        fetchData();
    }, [formId])

    useEffect(()=> {
        const fetchData = async ()=> {
            const response = await fetch('/api/useridentification/verify-token');
            if (response.status == 200) {
                const json = await response.json();
                setUser(json.user)
            }
        }

       fetchData();
    }, [])

    const changeFormId = (event) => {
        if (formId != event.target.id) {
            setFormId(event.target.id);
        }
        else {
            setFormId(0);
        }
    }
    
    const redirectAuth = (event)=> {
        window.location.href = `/auth?formMode=${(event.target.id == "logout")? "login": event.target.id}`;
    }

    const redirectDashboard = (event)=> {
        window.location.href = `/dashboard`;
    }


    return (
        <nav id="nav">
            <div id="navLeft">
                <h2><a href='/' style={{"color": "white", "textDecoration": "none"}}>Team Management App</a></h2>
            </div>
            {(user && currentPath == '/dashboard')
            ?(user.position == 'Manager')
            ?<div id="navCenter">
                <button id='1' onClick={changeFormId}>Assign Task</button>
                <button id='3' onClick={changeFormId}>Create Meeting</button>
                <button id='4' onClick={changeFormId}>Add Worker</button>
                <button id='5' onClick={changeFormId}>Send Message</button>
            </div>
            :<div id="navCenter">
                <button id='2' onClick={changeFormId}>Make Request</button>
                <button id='5' onClick={changeFormId}>Send Message</button>
            </div> 
            : null }
            {(!user)
            ? (
            <div id="navRight">
                <button id="login" onClick={redirectAuth}>Log in</button>
                <button id='signup' onClick={redirectAuth}>Sign Up</button>
            </div>
            ) : (
            <div id="navRight">
                <button id="dashboard" onClick={redirectDashboard}>Dashboard</button>
                <button id="logout" onClick={redirectAuth}>Logout</button>
            </div>
            )}
            {(formId != 0)? (
                <Form categoryId={formId-1} model={model} modelName={categoryURLs[formId].split('/')[3]}/>
            ): null}
        </nav>
    );
  };
  
  export default NavBar;
  