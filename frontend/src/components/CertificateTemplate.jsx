// frontend/src/components/CertificateTemplate.jsx

import React from 'react';

// React.forwardRef zaroori hai taaki Home page iska photo (PDF) le sake
const CertificateTemplate = React.forwardRef((props, ref) => {
  
  // Agar data nahi aaya to kuch mat dikhao (Crash se bachne ke liye)
  if (!props.data) return null;

  const { studentName, internshipDomain, startDate, endDate, certificateId } = props.data;

  // Dates ko sundar format mein dikhane ke liye helper function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    // Yeh ref={ref} sabse zaroori hai PDF download ke liye
    <div ref={ref} style={styles.container}>
      <div style={styles.border}>
        <div style={styles.innerBorder}>
          
          {/* Header Section */}
          <div style={styles.header}>
            <h1 style={styles.title}>Certificate of Completion</h1>
            <p style={styles.subtitle}>This is to certify that</p>
          </div>
          
          {/* Student Name */}
          <h2 style={styles.studentName}>{studentName}</h2>
          
          {/* Body Text */}
          <div style={styles.body}>
            <p style={styles.text}>
              has successfully completed an internship in the domain of
            </p>
            <h3 style={styles.domain}>{internshipDomain}</h3>
            <p style={styles.text}>
              from <b>{formatDate(startDate)}</b> to <b>{formatDate(endDate)}</b>.
            </p>
            <p style={styles.text}>
              We appreciate their dedication, hard work, and contribution during this period.
            </p>
          </div>

          {/* Footer / Signatures */}
          <div style={styles.footer}>
            
            {/* Authorized Sign */}
            <div style={styles.signatureBlock}>
              <div style={styles.fakeSignature}>Hirengohel</div> {/* Dummy Sign */}
              <hr style={styles.line} />
              <p style={styles.label}>Authorized Signature</p>
            </div>

            {/* Date & ID */}
            <div style={styles.signatureBlock}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                ID: {certificateId}
              </p>
              <hr style={styles.line} />
              <p style={styles.label}>Date of Issue: {new Date().toLocaleDateString()}</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
});

// --- CSS Styles (Certificate Design) ---
const styles = {
  container: {
    width: '850px',      // A4 Landscape width (approx)
    height: '560px',     // A4 Landscape height (approx)
    margin: '0 auto',    // Center mein laane ke liye
    padding: '20px',
    backgroundColor: '#fff',
    textAlign: 'center',
    fontFamily: "'Times New Roman', serif",
    color: '#333',
    boxSizing: 'border-box', // Padding ko width mein count karega
  },
  border: {
    border: '10px solid #2c3e50', // Dark Blue border
    height: '100%',
    padding: '5px',
    boxSizing: 'border-box',
  },
  innerBorder: {
    border: '2px solid #c0392b', // Red thin border
    height: '100%',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Content ko faila dega
    boxSizing: 'border-box',
    backgroundImage: 'radial-gradient(circle, #fff 80%, #f5f5f5 100%)' // Halka sa texture
  },
  header: {
    marginBottom: '10px',
  },
  title: {
    fontSize: '42px',
    color: '#2c3e50',
    textTransform: 'uppercase',
    margin: '0',
    letterSpacing: '2px',
  },
  subtitle: {
    fontSize: '20px',
    margin: '10px 0',
    fontStyle: 'italic',
    color: '#555',
  },
  studentName: {
    fontSize: '30px',
    fontFamily: "'Times New Roman', serif,", // Agar font nahi hai to cursive lega
    color: '#242121ff',
    fontStyle: 'italic',  
    margin: '10px 0',
    borderBottom: '1px solid #ddd',
    display: 'inline-block',
    padding: '0 20px',
  },
  body: {
    margin: '10px 0',
  },
  text: {
    fontSize: '18px',
    margin: '8px 0',
    lineHeight: '1.5',
  },
  domain: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#2980b9',
    margin: '5px 0',
    textTransform: 'capitalize',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '20px',
    padding: '0 40px',
  },
  signatureBlock: {
    textAlign: 'center',
    width: '220px',
  },
  fakeSignature: {
    fontFamily: "'Brush Script MT', cursive",
    fontSize: '24px',
    color: '#333',
    marginBottom: '5px',
  },
  line: {
    border: '0',
    borderTop: '1px solid #333',
    marginBottom: '5px',
  },
  label: {
    fontSize: '14px',
    color: '#555',
    margin: '0',
  }
};

export default CertificateTemplate;