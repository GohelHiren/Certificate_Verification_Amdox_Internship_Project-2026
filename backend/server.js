// // backend/server.js

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import certificateRoutes from './routes/certificateRoutes.js'; // <-- Line 1

// // Config ko load karega (jaise DB_URL)
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware (Server ke helpers)
// app.use(cors());
// app.use(express.json());

// // --- Database Connection ---
// const connectDB = async () => {
//   try {
//     // .env file se DB_URL uthayega
//     await mongoose.connect(process.env.DB_URL);
//     console.log('MongoDB connected successfully!');
//   } catch (error) {
//     console.error('MongoDB connection failed:', error.message);
//     process.exit(1); // Agar DB connect na ho to server band kar do
//   }
// };

// connectDB(); // Connection function ko call kiya
// // ---------------------------------------------

// // Test Route (Check karne ke liye ki server chal raha hai)
// app.get('/', (req, res) => {
//   res.send('Backend server is running!');
// });

// // --- API Routes ---
// app.use('/api/certificates', certificateRoutes); // <-- Line 2

// // Server ko start karega
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
// backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import certificateRoutes from './routes/certificateRoutes.js'; 
import authRoutes from './routes/authRoutes.js'; // <-- Line 1

// Config ko load karega (jaise DB_URL)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (Server ke helpers)
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const connectDB = async () => {
  try {
    // .env file se DB_URL uthayega
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB connected successfully!✅');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); 
  }
};

connectDB(); 


// Test Route 
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// --- API Routes ---
app.use('/api/certificates', certificateRoutes); 
app.use('/api/auth', authRoutes); // <-- Line 2

// Server ko start karega
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});