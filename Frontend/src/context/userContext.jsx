import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ReportsContext = createContext();

const UserContextProvider = ({ children }) => {
    const [reports, setReports] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Read authToken from cookies instead of localStorage
        const cookieStr = document.cookie; 
        const token = cookieStr
          .split('; ')
          .find(row => row.startsWith('authToken='))
          ?.split('=')[1];
        console.log('Extracted authToken:', token); // Log the extracted token

        // Fetch reports from /api/genAI
        axios.get('/api/genAI', { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log('Fetched reports:', response.data); // Log fetched reports
                setReports(response.data);
            })
            .catch(error => {
                console.error('Error fetching reports:', error);
            });

        // Fetch user data from /api/home
        axios.get('/api/home', { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log('Fetched user data:', response.data); // Log fetched user data
                setUserData(response.data.user);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    return (
        <ReportsContext.Provider value={{ reports, userData, doctors: userData?.doctors || [] }}>
            {children}
        </ReportsContext.Provider>
    );
};

export default UserContextProvider;
