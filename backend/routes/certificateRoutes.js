// // backend/routes/certificateRoutes.js

// import express from 'express';
// import multer from 'multer'; // File upload ke liye
// import xlsx from 'xlsx'; // Excel read karne ke liye
// import Certificate from '../models/Certificate.js'; // Model
// import authMiddleware from '../middleware/authMiddleware.js'; // Admin check ke liye

// const router = express.Router();

// // --- Multer setup ---
// // File ko server par save nahi karenge, memory mein hi rakhenge
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // --- Admin Route: Excel Upload ---
// // POST /api/certificates/upload
// // Pehle 'authMiddleware' chalega (check karega admin hai ya nahi)
// // Phir 'upload.single('file')' chalega (file ko memory mein daalega)
// router.post(
//   '/upload',
//   authMiddleware,
//   upload.single('file'),
//   async (req, res) => {
//     try {
//       // 1. Check karo ki file hai ya nahi
//       if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//       }

//       // 2. File ke buffer ko padho
//       const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      
//       // 3. Pehli sheet ka naam lo
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];

//       // 4. Sheet ke data ko JSON mein badlo
//       const data = xlsx.utils.sheet_to_json(sheet);

//       if (data.length === 0) {
//         return res.status(400).json({ message: 'Excel file is empty' });
//       }

//       // 5. Data ko database model ke hisaab se format karo
//       const certificates = data.map((row) => {
//         // Excel date (jo ek number hota hai) ko normal Date object mein badlo
//         const excelDateToJSDate = (serial) => {
//           if (typeof serial !== 'number') return serial; // Agar pehle se date hai
//           const utc_days = Math.floor(serial - 25569);
//           const date = new Date(utc_days * 86400 * 1000);
//           return new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
//         };
        
//         return {
//           certificateId: row['Certificate ID'], // Column naam Excel se match hona chahiye
//           studentName: row['Student Name'],
//           internshipDomain: row['Internship Domain'],
//           startDate: excelDateToJSDate(row['Start Date']),
//           endDate: excelDateToJSDate(row['End Date']),
//         };
//       });

//       // 6. Saare data ko ek saath database mein save karo
//       await Certificate.insertMany(certificates);

//       res
//         .status(201)
//         .json({ message: `${certificates.length} certificates uploaded successfully` });
        
//     } catch (error) {
//       console.error('Upload error:', error);
//       res.status(500).json({ message: 'Error uploading file' });
//     }
//   }
// );

// // --- Public Route: Certificate Verification ---
// // GET /api/certificates/verify/:id
// // (Yeh code pehle se tha, bas ise neeche rehne do)
// router.get('/verify/:id', async (req, res) => {
//   try {
//     const certificate = await Certificate.findOne({
//       certificateId: req.params.id,
//     });

//     if (!certificate) {
//       return res.status(404).json({ message: 'Certificate not found' });
//     }
//     res.status(200).json(certificate);
//   } catch (error) {
//     console.error('Error verifying certificate:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;
import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import Certificate from '../models/Certificate.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper Function: Date Parser (Ab ye crash nahi karega)
const parseDate = (value) => {
  if (!value) return new Date(); // Agar empty hai to aaj ki date
  
  // Excel Serial Number (e.g. 45321)
  if (typeof value === 'number') {
    const utc_days = Math.floor(value - 25569);
    const date = new Date(utc_days * 86400 * 1000);
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  }
  
  // String Date
  const date = new Date(value);
  // Check karo ki date valid hai ya nahi
  if (isNaN(date.getTime())) {
    return new Date(); // Agar invalid hai to aaj ki date daal do (Crash bachane ke liye)
  }
  return date;
};

// --- Admin Route: Excel Upload ---
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // 1. Excel Read
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      if (data.length === 0) {
        return res.status(400).json({ message: 'Excel file is empty' });
      }

      console.log("Excel Data First Row:", data[0]); // Debugging ke liye

      // 2. Data Formatting
      const certificates = [];
      let skippedCount = 0;

      for (const row of data) {
        // Alag alag tarah ke column names try karo
        const id = row['Certificate ID'] || row['certificate id'] || row['CertificateID'] || row['ID'];
        const name = row['Student Name'] || row['student name'] || row['Name'] || row['StudentName'];
        const domain = row['Internship Domain'] || row['internship domain'] || row['Domain'] || row['InternshipDomain'];
        const start = row['Start Date'] || row['start date'] || row['StartDate'];
        const end = row['End Date'] || row['end date'] || row['EndDate'];

        if (id && name && domain) {
           certificates.push({
            certificateId: String(id).trim(),
            studentName: name,
            internshipDomain: domain,
            startDate: parseDate(start),
            endDate: parseDate(end),
          });
        } else {
           skippedCount++;
        }
      }

      if (certificates.length === 0) {
        return res.status(400).json({ 
          message: 'No valid data found. Please check Excel column names.',
          hint: 'Required Columns: Certificate ID, Student Name, Internship Domain, Start Date, End Date'
        });
      }

      // 3. Database Save
      try {
        await Certificate.insertMany(certificates, { ordered: false });
        
        let msg = `Successfully uploaded ${certificates.length} certificates!`;
        if (skippedCount > 0) msg += ` (${skippedCount} invalid rows skipped)`;
        
        res.status(201).json({ message: msg });

      } catch (insertError) {
        // Duplicate Error Code: 11000
        if (insertError.code === 11000 || insertError.writeErrors) {
           const addedCount = insertError.result?.nInserted || insertError.insertedDocs?.length || 0;
           res.status(201).json({ message: `Uploaded ${addedCount} new certificates. (Duplicates skipped)` });
        } else {
           console.error("Database Insert Error:", insertError);
           throw insertError;
        }
      }

    } catch (error) {
      console.error('SERVER ERROR:', error);
      res.status(500).json({ message: `Server Error: ${error.message}` });
    }
  }
);

// --- Public Route: Verify ---
router.get('/verify/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.id,
    });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.status(200).json(certificate);
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;