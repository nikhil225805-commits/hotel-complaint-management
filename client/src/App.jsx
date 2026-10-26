
import { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [message, setMessage] = useState('');

  async function loadComplaints() {
    try {
      const response = await fetch(
        'http://localhost:5000/api/complaints'
      );

      if (!response.ok) {
        throw new Error('Could not load complaints');
      }

      const data = await response.json();
      setComplaints(data);
      setMessage('');
    } catch (error) {
      setMessage('Could not load complaints. Check the backend.');
    }
  }

  async function submitComplaint(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        'http://localhost:5000/api/complaints',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, room, description }),
        }
      );

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setName('');
      setRoom('');
      setDescription('');

      alert('Complaint submitted successfully!');
    } catch (error) {
      alert('Could not submit complaint. Check the backend.');
    }
  }

  function openAdmin() {
    setShowAdmin(true);
    loadComplaints();
  }

  return (
    <div className="app">
      <h1>Hotel Complaint Management</h1>
      <p className="subtitle">
        We value your comfort and feedback.
      </p>

      <nav className="navigation">
        <button type="button" onClick={() => setShowAdmin(false)}>
          Guest Form
        </button>

        <button type="button" onClick={openAdmin}>
          Admin Dashboard
        </button>
      </nav>

      {!showAdmin ? (
        <>
          <h2>Submit a Complaint</h2>

          <form onSubmit={submitComplaint}>
            <label>Guest Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Room Number</label>
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />

            <label>Complaint Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button type="submit">Submit Complaint</button>
          </form>
        </>
      ) : (
        <>
          <h2>Admin Dashboard</h2>

          <p>
            Total complaints: <strong>{complaints.length}</strong>
          </p>

          <button type="button" onClick={loadComplaints}>
            Refresh Complaints
          </button>

          {message && <p>{message}</p>}

          {complaints.length === 0 && !message && (
            <p>No complaints found.</p>
          )}

          {complaints.map((complaint) => (
            <div className="complaint" key={complaint._id || complaint.id}>
              <p><strong>Guest:</strong> {complaint.name}</p>
              <p><strong>Room:</strong> {complaint.room}</p>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
