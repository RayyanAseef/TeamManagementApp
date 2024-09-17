import Network from '../Network.png';
import Security from '../Security.png';
import Roles from '../Roles.png';

function Home() {
    return (
      <div id='main'>
        <div id="imageLeft"><img src={Security} alt=''/></div>
        <div id="imageCenter">
          <img src={Network} alt=''/>
          <h1>Team Management App</h1>
          <div id='entryButtons'>
            <button>Log in</button>
            <button>Sign Up</button>
          </div>
        </div>
        <div id="imageRight"><img src={Roles} alt=''/></div>
      </div>
    );
  }
  
  export default Home;
  