import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Reports = () => {
  const { id } = useParams();
  const [reports, setReports] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log('Fetching reports for patient ID:', id); // Debug patient ID
        const response = await axios.get(`/api/reports/${id}`);
        console.log('Fetched reports:', response.data.reports); // Debug fetched reports
        setReports(response.data.reports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [id]);

  const handleViewPhoto = (photoBase64) => {
    if (photoBase64) {
      console.log('Viewing photo with Base64 data:', photoBase64); // Debug photo Base64 data
      const photoUrl = `data:image/png;base64,${photoBase64}`;
      setSelectedPhoto(photoUrl);
    } else {
      console.warn('No photo data available to view.');
    }
  };

  const handleViewPdf = (pdfBase64) => {
    if (pdfBase64) {
      console.log('Viewing PDF with Base64 data:', pdfBase64.substring(0, 100)); // Log first 100 characters of Base64 data
      const pdfUrl = `data:application/pdf;base64,${pdfBase64}`;
      setSelectedPdf(pdfUrl);
    } else {
      console.warn('No PDF data available to view.');
    }
  };

  // Test with a sample Base64 string
  useEffect(() => {
    const samplePdfBase64 = 'JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwvTGluZWFyaXplZCAxL0wgMjE0NzgvTyAyL0UgMTAzMzgvTiAxL1QgMjA5NjgvSCBbIDYzNiAxMjZdPj4KZW5kb2JqCjIgMCBvYmoKPDwvQ3JlYXRvciAoQWRvYmUgQWNyb2JhdCBQcm9mZXNzaW9uYWwpL1Byb2R1Y2VyIChBZG9iZSBQREYgTGl...' // Truncated Base64 string
    handleViewPdf(samplePdfBase64);
  }, []);

  const handleDownloadPdf = (pdfBase64, reportId) => {
    if (pdfBase64) {
      console.log('Downloading PDF for report ID:', reportId);
      const pdfUrl = `data:application/pdf;base64,${pdfBase64}`;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `report-${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('No PDF data available to download.');
    }
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleClosePdf = () => {
    setSelectedPdf(null);
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
                  {report.photo && (
                    <>
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
                    </>
                  )}
                  {report.fileData && (
                    <>
                      <button
                        onClick={() => handleViewPdf(report.fileData)}
                        className="text-blue-600 underline"
                      >
                        View PDF
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(report.fileData, report._id)}
                        className="text-blue-600 underline"
                      >
                        Download PDF
                      </button>
                    </>
                  )}
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

      {/* Modal overlay to display selected PDF */}
      {selectedPdf && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <div>
              <button
                onClick={handleClosePdf}
                className="bg-red-500 mt-10 text-white w-full font-bold text-lg"
              >
                Close
              </button>
            </div>
            <div>
              <iframe
                src={selectedPdf}
                title="PDF Report"
                className="w-full h-screen"
                frameBorder="0"
                allow="fullscreen"
                onLoad={() => console.log('PDF iframe loaded successfully')} // Debug iframe load
                onError={() => console.error('Error loading PDF in iframe')} // Debug iframe error
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;