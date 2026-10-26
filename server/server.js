
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Complaint database structure
const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  room: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

app.get('/', (req, res) => {
  res.send('Hotel Complaint Management API is running!');
});

// Get all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get complaints' });
  }
});

// Submit a complaint
app.post('/api/complaints', async (req, res) => {
  try {
    const { name, room, description } = req.body;

    if (!name || !room || !description) {
      return res.status(400).json({
        message: 'Please fill in all fields'
      });
    }

    const complaint = await Complaint.create({
      name,
      room,
      description
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save complaint' });
  }
});

// Connect to MongoDB before starting the server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });

  