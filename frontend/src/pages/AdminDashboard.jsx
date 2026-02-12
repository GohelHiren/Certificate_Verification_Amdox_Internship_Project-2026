// frontend/src/pages/AdminDashboard.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Jab file select karein
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  // Jab upload button dabayein
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Token nikalo (Authentication ke liye)
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('http://localhost:5000/api/certificates/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token // Backend middleware ko token chahiye
        },
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error uploading file');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button 
          onClick={handleLogout}
          style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      
      <hr />

      <div style={{ marginTop: '30px', maxWidth: '500px' }}>
        <h3>Upload Student Data (Excel)</h3>
        <p>Please upload an .xlsx file with columns: Certificate ID, Student Name, Internship Domain, Start Date, End Date.</p>
        
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            onChange={handleFileChange} 
            style={{ padding: '10px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit" 
            style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Upload Data
          </button>
        </form>

        {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;