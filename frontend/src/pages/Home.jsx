import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CertificateTemplate from '../components/CertificateTemplate';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [id, setId] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // --- Profile States ---
  const [userData, setUserData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const certificateRef = useRef();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // --- Fetch User Data on Mount ---
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { 'x-auth-token': token }
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };
    fetchUserData();
  }, [token]);

  // --- Search Handler ---
  const handleSearch = async (e) => {
    e.preventDefault();

    // --- SECURITY CHECK: Pehle Login zaroori hai ---
    if (!token) {
      alert("🔒 Please Login or Register to verify certificates.");
      navigate('/login'); // Seedha login page par bhejo
      return;
    }

    if (!id) return;
    setError('');
    setCertificateData(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/certificates/verify/${id}`);
      setCertificateData(res.data);
      setTimeout(() => {
        document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError('❌ Certificate not found. Please check the ID and try again.');
    }
  };

  // --- PDF Download Handler ---
  const handleDownloadPDF = async () => {
    // Double check
    if (!token) {
      alert("🔒 Please login to download the certificate.");
      navigate('/login');
      return;
    }

    const input = certificateRef.current;
    if (!input) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${id}.pdf`);
    } catch (error) {
      alert("Download failed.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload(); // State refresh karne ke liye
  };

  return (
    <div style={styles.pageContainer}>
      {/* --- NAVBAR --- */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          🎓 Certi<span style={{color: '#007bff'}}>Verify</span>
        </div>
        <div style={styles.navLinks}>
          {!token ? (
            <>
              <button onClick={() => navigate('/login')} style={styles.navButtonOutline}>Login</button>
              <button onClick={() => navigate('/register')} style={styles.navButtonFilled}>Get Started</button>
            </>
          ) : (
            <>
              {role === 'admin' && (
                <button onClick={() => navigate('/admin')} style={styles.navButtonOutline}>Dashboard</button>
              )}
              
              {/* Profile Badge */}
              {userData && (
                  <div 
                      onClick={() => setShowProfile(!showProfile)} 
                      style={{ 
                          display: 'flex', alignItems: 'center', gap: '8px', 
                          cursor: 'pointer', padding: '8px 15px', borderRadius: '25px', 
                          backgroundColor: '#e3f2fd', color: '#0d47a1', fontWeight: 'bold',
                          border: '1px solid #bbdefb'
                      }}
                  >
                      <span>👤 {userData.name}</span>
                  </div>
              )}
  
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </>
          )}
        </div>
      </nav>

      {/* --- PROFILE MODAL (POPUP) --- */}
      {showProfile && userData && (
          <div style={{
              position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
              display: 'flex', justifyContent: 'center', alignItems: 'center'
          }} onClick={() => setShowProfile(false)}>
              
              <div 
                onClick={(e) => e.stopPropagation()} 
                style={{
                  backgroundColor: '#fff', padding: '30px', borderRadius: '15px',
                  width: '350px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', textAlign: 'center',
                  position: 'relative'
                }}
              >
                  <button 
                    onClick={() => setShowProfile(false)}
                    style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                  >✖</button>

                  <div style={{ fontSize: '50px', marginBottom: '10px' }}>👤</div>
                  <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>{userData.name}</h2>
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '0' }}>{role === 'admin' ? 'Administrator' : 'Student Account'}</p>
                  
                  <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
                  
                  <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>EMAIL ADDRESS</label>
                      <div style={{ fontSize: '16px', color: '#333', padding: '8px', background: '#f9f9f9', borderRadius: '5px', marginTop: '5px' }}>
                          {userData.email}
                      </div>
                  </div>

                  <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                      <label style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>PASSWORD</label>
                      <div style={{ fontSize: '16px', color: '#333', padding: '8px', background: '#f9f9f9', borderRadius: '5px', marginTop: '5px', letterSpacing: '3px' }}>
                          ••••••••
                      </div>
                      <p style={{ fontSize: '10px', color: '#999', marginTop: '5px' }}>*Password is encrypted.</p>
                  </div>
                  
                  <button 
                    onClick={() => setShowProfile(false)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Close
                  </button>
              </div>
          </div>
      )}

      {/* --- HERO SECTION --- */}
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Verify Credentials with Confidence</h1>
          <p style={styles.heroSubtitle}>
            Instant verification for student internships and certifications. 
            Secure, fast, and reliable.
          </p>
          
          <form onSubmit={handleSearch} style={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Enter Certificate ID (e.g., CERT101)" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              Verify Now
            </button>
          </form>
          
          {error && <div style={styles.errorMessage}>{error}</div>}
        </div>
      </header>

      {/* --- RESULT SECTION --- */}
      {certificateData && (
        <section id="result-section" style={styles.resultSection}>
          <h2 style={styles.sectionTitle}>Verification Successful ✅</h2>
          <div style={styles.certificateWrapper}>
            <CertificateTemplate ref={certificateRef} data={certificateData} />
          </div>
          <div style={{marginTop: '30px'}}>
            <button 
              onClick={handleDownloadPDF} 
              disabled={loading} 
              style={styles.downloadButton}
            >
              {loading ? 'Generating PDF...' : (token ? '⬇️ Download Official PDF' : '🔒 Login to Download PDF')}
            </button>
          </div>
        </section>
      )}

      {/* --- FEATURES SECTION --- */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose CertiVerify?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.icon}>⚡</div>
            <h3>Instant Verification</h3>
            <p>Verify any certificate in seconds by just entering the unique ID.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.icon}>🔒</div>
            <h3>100% Secure</h3>
            <p>Data is stored securely in our encrypted database. No tampering.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.icon}>📄</div>
            <h3>Easy Downloads</h3>
            <p>Get high-quality PDF copies of your certificates anytime.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={styles.footer}>
        <p>© 2025 CertiVerify System. All rights reserved.</p>
      </footer>
    </div>
  );
};

// --- STYLES (Inline CSS - No Tailwind) ---
const styles = {
  pageContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 50px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: '-1px',
  },
  navLinks: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center', // Align items vertically
  },
  navButtonOutline: {
    padding: '8px 20px',
    border: '2px solid #007bff',
    backgroundColor: 'transparent',
    color: '#007bff',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: '0.3s',
  },
  navButtonFilled: {
    padding: '8px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: '0.3s',
  },
  logoutButton: {
    padding: '8px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  hero: {
    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
    color: '#fff',
    textAlign: 'center',
    padding: '100px 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  heroContent: {
    maxWidth: '700px',
    width: '100%',
  },
  heroTitle: {
    fontSize: '48px',
    marginBottom: '20px',
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: '18px',
    marginBottom: '40px',
    opacity: '0.9',
    lineHeight: '1.6',
  },
  searchContainer: {
    display: 'flex',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '50px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    padding: '15px 20px',
    fontSize: '16px',
    outline: 'none',
    borderRadius: '50px',
  },
  searchButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '15px 40px',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  errorMessage: {
    marginTop: '20px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '8px',
    display: 'inline-block',
  },
  resultSection: {
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: '32px',
    marginBottom: '30px',
    color: '#333',
    fontWeight: '700',
  },
  certificateWrapper: {
    display: 'inline-block',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    transform: 'scale(0.9)', 
  },
  downloadButton: {
    padding: '15px 30px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
  },
  featuresSection: {
    padding: '80px 50px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '15px',
  },
  footer: {
    backgroundColor: '#343a40',
    color: '#fff',
    textAlign: 'center',
    padding: '30px',
  }
};

export default LandingPage;