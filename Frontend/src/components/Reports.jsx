import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams for accessing route params
import axios from 'axios'; // Import axios

const Reports = () => {
  const { id } = useParams(); // Access the patient ID from the route params
  const [reports, setReports] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`/api/reports/${id}`); // Fetch reports for the patient
        setReports(response.data.reports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [id]);

  const handleViewPhoto = (photoBase64) => {
    if (photoBase64) {
      const photoUrl = `data:image/png;base64,${photoBase64}`; // Use Base64 string directly
      setSelectedPhoto(photoUrl);
    }
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="p-5">
      <h1 className="text-xl text-blue-500 font-semibold">Patient Reports</h1>
      {reports.length > 0 ? (
        <ul className="mt-5">
          {reports.map((report, index) => (
            <li key={index} className="mb-4 border p-2">
              <h4 className="font-bold">
                {new Date(report.dateTime).toLocaleString()}
              </h4>
              <p>ID: {report._id}</p>
              <div className="flex justify-between">
                <div className="flex gap-5 mt-2">
                  <button
                    onClick={() => handleViewPhoto(report.photo)}
                    className="text-blue-600 underline"
                  >
                    View Photo
                  </button>
                  <a
                    href={`data:image/png;base64,${report.photo}`}
                    download={`report-${report._id}.png`}
                    className="text-blue-600 underline"
                  >
                    Download Photo
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reports found for this patient.</p>
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
              <img
                src={selectedPhoto}
                alt="Report"
                className="max-w-full max-h-screen"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;