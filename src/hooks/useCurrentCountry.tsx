import { useState, useEffect } from 'react';

function useCurrentCountry() {
    const [userCountry, setUserCountry] = useState({ country: '', region: '', city: '' });

    useEffect(() => {
        fetch(`/api/geoip`)
            .then((response) => response.json())
            .then((data) => {
                setUserCountry(data);
            }).catch((error) => {
                console.error('Error fetching user country:', error);
            });
    }, []);
    
    return userCountry;
}

export default useCurrentCountry;
