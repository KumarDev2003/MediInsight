import React, { useState, useEffect, useContext } from 'react';
import { ReportsContext } from '../context/userContext';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { userData } = useContext(ReportsContext); // Access userData from context
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/home', { credentials: 'include' });
        const data = await response.json();
        if (!data.loggedIn) {
          navigate('/sign-in'); // Redirect to sign-in if not logged in
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/sign-in'); // Redirect to sign-in on error
      }
    };

    checkAuth();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/delete/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        alert('Report deleted successfully.');
        navigate('/'); // Navigate back to home
      } else {
        alert('Failed to delete the report.');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('An error occurred while deleting the report.');
    }
  };

  const handleViewPhoto = (photoUrl) => {
    if (photoUrl) {
      setSelectedPhoto(photoUrl); // Use Base64 string directly
    }
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className='p-5 '>
      <NavBar />
      
      {userData && (
        <div className="mt-4">
          <h2 className='text-xl text-blue-500 font-semibold'>Welcome, <span className='font-bold'>{userData.name}</span> </h2>
          <h3 className='mt-5 text-blue-500 font-semibold'>Your Reports:</h3>
          <ul>
            {userData.reports.map((report, index) => (
              <li key={index} className="mb-4 border mt-5 p-2">
                <h4 className="font-bold">
                  {new Date(report.dateTime).toLocaleString()}
                </h4>
                <p>ID: {report._id}</p>
                <div className='flex justify-between' >
                  
                  <div className="flex gap-5 mt-2">

                      <button
                        onClick={() => handleViewPhoto(report.photo)}
                        className="text-blue-600 underline"
                        >
                        View Photo
                      </button>
                      <a 
                        href={report.photo} 
                        download 
                        className="text-blue-600 underline"
                        >
                        Download Photo
                      </a>

                  </div>

                  <div className='mt-2'>
                  <button
                      onClick={() => handleDelete(report._id)}
                      className='text-red-500 underline'
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal overlay to display selected photo */}
      {selectedPhoto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <div>
                <button
                  onClick={handleClosePhoto}
                  className="bg-red-500 mt-10 text-white w-full font-bold text-lg"
                >
                 Close
                </button>
            </div>
            <div>
                <img src={selectedPhoto} alt="Report" className="max-w-full max-h-screen" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
