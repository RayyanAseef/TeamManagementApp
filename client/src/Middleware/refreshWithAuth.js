
const fetchWithAuth = async (url, options = {})=> {
    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include'
        })

        if (response.status == 403) {
            const refreshResponse = await fetch('/api/useridentification/refresh', {
                method: 'GET',
                credentials: 'include'
            })
            
            if (refreshResponse.status == 200) {
                const retryResponse = await fetch(url, {
                    ...options,
                    credentials: 'include'
                })

                return retryResponse
            }

            window.location.href = '/auth'
        }

        return response;
    } catch (err) {
        console.log("Error with fetch request: ", err)
    }
}

export default fetchWithAuth;