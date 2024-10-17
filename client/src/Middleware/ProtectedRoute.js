import { Navigate, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import fetchWithAuth from './refreshWithAuth';

const ProtectedRoute = ({element: Component, ...rest}) => {
    const [ isAuthenticated, setIsAuthenticated ] = useState(null);
    const [ user, setUser ] = useState(null)

    useEffect( ()=> {
        const fetchData = async ()=> {
            const response = await fetchWithAuth("/api/useridentification/verify-token")
            const json = await response.json();
            if (response.status == 200) {
                setIsAuthenticated(true)
                setUser(json.user)
            } else {
                setIsAuthenticated(false)
            }
        }

        fetchData()
    }, [])

    if (isAuthenticated == null) {return <div>Loading...</div>}

    return (isAuthenticated)? (
        <Component {...rest} user={user}/>
    ) : (
        <Navigate to='/auth'/>
    )
}

export default ProtectedRoute;