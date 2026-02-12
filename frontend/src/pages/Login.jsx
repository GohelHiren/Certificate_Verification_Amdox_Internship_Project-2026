import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user', // Default role 'user' (student) hai
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Role ke hisaab se URL chuno
    const url = formData.role === 'admin' 
      ? 'http://localhost:5000/api/auth/admin/login' 
      : 'http://localhost:5000/api/auth/user/login';

    try {
      const res = await axios.post(url, { 
        email: formData.email, 
        password: formData.password 
      });

      // Token aur Role ko browser mein save karo (LocalStorage)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      alert('Login Successful!');

      // Role ke hisaab se page redirect karo
      if (formData.role === 'admin') {
        navigate('/admin'); // Admin dashboard par bhejo
      } else {
        // --- YEH BADAL DIYA HAI ---
        navigate('/'); // Ab student login karke seedha Portal wale page par jayega
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Role Selection Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Select Role:</label>
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

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
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
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px',
            borderRadius: '5px'
          }}
        >
          Login
        </button>
      </form>

      {/* --- Registration Link --- */}
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p>Don't have an account?{' '}
          <span 
            onClick={() => navigate('/register')} 
            style={{ 
              color: '#007bff', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
               
            }}
          >
            Register here
          </span>
        </p>
      </div>

    </div>
  );
};

export default Login;