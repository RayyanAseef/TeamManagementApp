import Network from '../Network.png';
import Security from '../Security.png';
import Roles from '../Roles.png';

function Home() {

  const redirectAuth = (event)=> {
    window.location.href = `/auth?formMode=${event.target.name}`
  }

    return (
      <div id='homeContainer'>
        <div id="imageLeft"><img src={Security} alt=''/></div>
        <div id="imageCenter">
          <img src={Network} alt=''/>
          <h1>Team Management App</h1>
          <div id='entryButtons'>
            <button name='login' onClick={redirectAuth}>Log in</button>
            <button name='signup' onClick={redirectAuth}>Sign Up</button>
          </div>
        </div>
        <div id="imageRight"><img src={Roles} alt=''/></div>
      </div>
    );
  }
  
  export default Home;
  