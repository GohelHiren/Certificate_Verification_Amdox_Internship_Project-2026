// frontend/src/pages/Register.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  
  // State mein 'role' add kar diya
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // Default student rahega
  });

  const [error, setError] = useState('');

  // Jab user type kare ya role select kare
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Jab form submit ho
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Role ke hisaab se sahi API URL chuno
    const url = formData.role === 'admin' 
      ? 'http://localhost:5000/api/auth/admin/register' 
      : 'http://localhost:5000/api/auth/user/register';

    try {
      // Backend API call
      const res = await axios.post(url, formData);
      alert(res.data.message); // Success message
      navigate('/login'); // Login page par bhejo
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>Create Account</h2>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Role Selection Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Register As:</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            style={{ padding: '10px', fontSize: '16px' }}
          >
            <option value="user">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Name Input */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <button 
          type="submit"
          style={{ 
            padding: '10px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '5px'
          }}
        >
          Register
        </button>
      </form>

      {/* --- NAYA CODE: Login Link --- */}
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p>Already have an account?{' '}
          <span 
            onClick={() => navigate('/login')} 
            style={{ 
              color: '#007bff', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              
            }}
          >
            Login here
          </span>
        </p>
      </div>
      {/* ----------------------------- */} 

    </div>
  );
};

export default Register;