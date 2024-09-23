const NavBar = () => {
    return (
        <nav id="nav">
            <div id="navLeft">
                <h2>Team Management App</h2>
            </div>
            <div id="navCenter">
                <button>Assign Task</button>
                <button>Make Request</button>
                <button>Create Meeting</button>
                <button>Add Worker</button>
                <button>Send Message</button>
            </div>
            <div id="navRight">
                <button id="login">Log in</button>
                <button id='signup'>Sign Up</button>
            </div>
        </nav>
    );
  };
  
  export default NavBar;
  