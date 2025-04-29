import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DocReportAnalysis = () => {
  const { id } = useParams(); // Get patient ID from route params
  const [reportAnalysis, setReportAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportAnalysis = async () => {
      try {
        const response = await axios.get(`/api/reportAnalysis/${id}`);
        console.log('Fetched report analysis:', response.data); // Log fetched report analysis
        setReportAnalysis(response.data.reportAnalysis);
      } catch (err) {
        console.error('Error fetching report analysis:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching the report analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="p-5">
        <p className="text-blue-500">Loading report analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!Array.isArray(reportAnalysis) || reportAnalysis.length === 0) {
    console.warn('No report analysis data available.'); // Warn if no report analysis data
    return (
      <div className="p-5">
        <h1 className="text-2xl mt-5 text-blue-500 font-bold">Report Analysis</h1>
        <p className="text-gray-600 mt-2">No report analysis data available.</p>
      </div>
    );
  }

  console.log('Parsed report analysis:', reportAnalysis); // Log parsed report analysis

  return (
    <div className="p-5">
      <h1 className="text-2xl mt-5 text-blue-500 font-bold">Report Analysis</h1>

      {reportAnalysis.map((section, index) => (
        <div key={index} className="mt-4 p-4 border rounded shadow-sm">
          <h2 className="text-xl font-semibold capitalize text-blue-500 mb-3">
            {Object.keys(section)[0]} {/* Extract and display the section heading */}
          </h2>
          <ul className="list-disc pl-6 text-gray-800">
            {section[Object.keys(section)[0]].map((item, i) => (
              <li key={i}>
                {item.replace(/\*/g, '')} {/* Remove '*' from the text */}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DocReportAnalysis;