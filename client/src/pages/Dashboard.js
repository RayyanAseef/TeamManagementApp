import { useEffect, useState } from "react";

function Dashboard({navHeight}) {
    const [categoryId, setCategoryId] = useState(0)

    useEffect(() => {
        const dashboard = document.getElementById('dashboardContainer');
        dashboard.style.height = `calc(100vh - ${navHeight}px)`; 
    }, [navHeight]);

    const changeCatgory = (event)=> {
        setCategoryId(event.target.id)
    }

    return (
      <div id="dashboardContainer">
        <div id="sidebar">
            <div id="topSidebar">
                <button id="0" onClick={changeCatgory}>Tasks</button>
                <button id="1" onClick={changeCatgory}>Requests</button>
                <button id="2" onClick={changeCatgory}>Meetings</button>
                <button id="3" onClick={changeCatgory}>Workers</button>
            </div>
            <div id="bottomSidebar">
                <button id="4" onClick={changeCatgory}>Messages</button>
            </div>
        </div>  
        <div id="content">
            <div id="headerRow"></div>
        </div>
      </div>
    );
  }
  
  export default Dashboard;
  