import { useEffect, useState, useCallback, useMemo } from "react";

const categoryURLs = {
    0: '/api/tasks',
    1: '/api/requests',
    2: '/api/meetings',
    3: '/api/workers',
    4: '/api/messages'
};

function Dashboard({ navHeight }) {
    const queryParameters = new URLSearchParams(window.location.search);
    const initialCategory = queryParameters.get('id') ? queryParameters.get('id') : 0;

    const [categoryId, setCategoryId] = useState(initialCategory);
    const [list, setList] = useState([]);
    const [cachedData, setCachedData] = useState({});

    const dashboardHeight = useMemo(() => `calc(100vh - ${navHeight}px)`, [navHeight]);

    useEffect(() => {
        const fetchData = async () => {
            if (cachedData[categoryId]) {
                setList(cachedData[categoryId]);
                return;
            }

            try {
                const res = await fetch(categoryURLs[categoryId]);
                const json = await res.json();
                setList(json);
                setCachedData((prevData) => ({ ...prevData, [categoryId]: json }));
            } catch (err) {
                console.error("Error fetching list.");
            }
        };

        fetchData();
    }, [categoryId, cachedData]);

    const changeCategory = useCallback((event) => {
        setCategoryId(event.target.id);
    }, []);

    const formatKey = useCallback((key) => {
        key = key.replace(/([A-Z])/g, ' $1');
        return key.charAt(0).toUpperCase() + key.slice(1);
    }, []);

    return (
        <div id="dashboardContainer" style={{ height: dashboardHeight }}>
            <div id="sidebar">
                <div id="topSidebar">
                    {Object.keys(categoryURLs).slice(0, 4).map((id) => (
                        <button key={id} id={id} onClick={changeCategory}>
                            {formatKey(categoryURLs[id].split('/')[2])}
                        </button>
                    ))}
                </div>
                <div id="bottomSidebar">
                    <button id="4" onClick={changeCategory}>Messages</button>
                </div>
            </div>
            <div id="content">
                <div id="headerRow">
                    {Object.keys(list[0] || {}).map((key) => (
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
                                        <h4>{typeof item[key] === 'boolean'? item[key] ? 'Ongoing' : 'Completed': item[key]}</h4>
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