// backend/models/Certificate.js

import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: [true, 'Certificate ID is required'],
    unique: true, // Har ID unique honi chahiye
    trim: true,
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
  },
  internshipDomain: {
    type: String,
    required: [true, 'Internship domain is required'],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  issuedOn: {
    type: Date,
    default: Date.now, // Yeh date automatically set ho jayegi
  },
});

const Certificate = mongoose.model('Certificate', CertificateSchema);

export default Certificate;