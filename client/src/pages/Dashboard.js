import { useEffect, useState, useCallback, useMemo } from "react";

const categoryURLs = {
    0: { 
      labels: '/api/models/Tasks', 
      content: '/api/tasks'    
    },
    1: { 
      labels: '/api/models/Requests', 
      content: '/api/requests'     
    },
    2: { 
      labels: '/api/models/Meetings', 
      content: '/api/meetings'      
    },
    3: { 
      labels: '/api/models/Workers',  
      content: '/api/workers'         
    },
    4: { 
      labels: '/api/models/Messages', 
      content: '/api/messages'     
    }
};

function Dashboard({ navHeight }) {
    const queryParameters = new URLSearchParams(window.location.search);
    const initialCategory = queryParameters.get('id') ? queryParameters.get('id') : 0;

    const [categoryId, setCategoryId] = useState(initialCategory);
    const [list, setList] = useState([]);
    const [labels, setLabels] = useState([])
    const [cachedData, setCachedData] = useState({});

    const dashboardHeight = useMemo(() => `calc(100vh - ${navHeight}px)`, [navHeight]);

    useEffect(() => {
        const fetchData = async () => {
            if (cachedData[categoryId]) {
                setList(cachedData[categoryId].content);
                setLabels(cachedData[categoryId].label)
                return;
            }

            try {
                const resContent = await fetch(categoryURLs[categoryId].content);
                const jsonContent = await resContent.json();
                setList(jsonContent);

                const resLabels = await fetch(categoryURLs[categoryId].labels);
                const jsonLabels = await resLabels.json();
                setLabels(jsonLabels);
                
                setCachedData((prevData) => ({ ...prevData, [categoryId]: { label: jsonLabels, content: jsonContent } }));
            } catch (err) {
                console.error("Error fetching list + labels.");
            }
        };

        const categorybtns = document.getElementsByClassName('categoryBtns');
        Array.from(categorybtns).forEach((btn, index) => {
            btn.className = (categoryId == index)? 'categoryBtns selected': 'categoryBtns';
        });

        fetchData();
    }, [categoryId, cachedData]);

    const changeCategory = useCallback((event) => {
        setCategoryId(event.target.id);
    }, []);

    const formatKey = useCallback((key) => {
        key = key.replace(/([A-Z])/g, ' $1');
        return key.charAt(0).toUpperCase() + key.slice(1);
    }, []);

    const formatDateTime = (datetime) => {
        const months = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec" };
    
        const date = datetime.split('T')[0]; // Extracts 'YYYY-MM-DD'
        const time = datetime.split('T')[1]; // Extracts 'HH:MM:SS'
        const dateParts = date.split('-'); // Splits 'YYYY-MM-DD' into ['YYYY', 'MM', 'DD']
        const timeParts = time.split(':'); // Splits 'HH:MM:SS' into ['HH', 'MM', 'SS']
        
        // Convert the hour to 12-hour format and determine AM/PM
        let hour = Number(timeParts[0]) % 12 || 12; // Convert '0' to '12' for 12 AM/PM cases
        let period = (Number(timeParts[0]) >= 12) ? "PM" : "AM";
    
        // Return formatted string
        return `${hour}:${timeParts[1]} ${period} at ${months[dateParts[1]]} ${dateParts[2]}, ${dateParts[0]}`;
    };

    return (
        <div id="dashboardContainer" style={{ height: dashboardHeight }}>
            <div id="sidebar">
                <div id="topSidebar">
                    <button className='categoryBtns' id="0" onClick={changeCategory}>Tasks</button>
                    <button className='categoryBtns' id="1" onClick={changeCategory}>Requests</button>
                    <button className='categoryBtns' id="2" onClick={changeCategory}>Meetings</button>
                    <button className='categoryBtns' id="3" onClick={changeCategory}>Workers</button>
                </div>
                <div id="bottomSidebar">
                    <button className='categoryBtns' id="4" onClick={changeCategory}>Messages</button>
                </div>
            </div>
            <div id="content">
                <div id="headerRow">
                    {Object.keys(labels || {}).map((key) => (
                        key !== 'id' && key !== 'description' ? (
                            <div key={key} id="coloumnName">
                                <p>{formatKey(key)}</p>
                            </div>
                        ) : null
                    ))}
                </div>
                <div id="list">
                    {list.map((item, itemIndex) => (
                        <div className="item" key={itemIndex}>
                            {Object.keys(item).map((key, keyIndex) => (
                                key !== 'id' && key !== 'description' && typeof item[key] != 'object'? (
                                    <div key={keyIndex} className="field">
                                        <h4>{typeof item[key] == 'boolean'? item[key] ? 'Done' : 'Ongoing': (key=='meetingDate')? formatDateTime(item[key]): item[key]}</h4>
                                    </div>
                                ) : typeof item[key] == 'object'?
                                    <div key={keyIndex} className="field">
                                        <h4>{item[key].name}</h4>
                                    </div>: null
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;