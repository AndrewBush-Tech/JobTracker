import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: '',
    deadline: '',
    jobLink: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await axios.get('http://localhost:8080/api/applications');
    setApplications(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/applications/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:8080/api/applications', formData);
      }
      resetForm();
      fetchApplications();
    } catch (error) {
      console.error("❌ Error saving job application:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/applications/${id}`);
      fetchApplications();
    } catch (error) {
      console.error("❌ Delete failed:", error);
    }
  };

  const handleEdit = (app) => {
    setFormData({
      company: app.company,
      position: app.position,
      status: app.status,
      deadline: app.deadline || '',
      jobLink: app.jobLink || ''
    });
    setEditingId(app.id);
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      status: '',
      deadline: '',
      jobLink: ''
    });
    setEditingId(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const jobs = JSON.parse(text);

      if (!Array.isArray(jobs)) {
        alert("Invalid file format. Must be a JSON array.");
        return;
      }

      await axios.post('http://localhost:8080/api/applications/bulk-upload', jobs);
      alert("Jobs imported successfully!");
      fetchApplications();
    } catch (err) {
      console.error("File import error:", err);
      alert("Failed to import jobs. Check console for details.");
    }
  };

  return (
    <div className="App">
      <div className="sticky-header">
        <h1>💼 Job Application Tracker</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="status"
            placeholder="Status (e.g., Applied, Interview)"
            value={formData.status}
            onChange={handleChange}
          />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
          <input
            type="text"
            name="jobLink"
            placeholder="Job Link"
            value={formData.jobLink}
            onChange={handleChange}
          />
          <button type="submit">
            {editingId ? "Update Application" : "Add Application"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          )}
        </form>

        <div style={{ marginTop: '10px' }}>
          <label>📤 Import Job Applications (JSON): </label>
          <input type="file" accept=".json" onChange={handleFileUpload} />
        </div>
      </div>

      <div className="application-list">
        <ul>
          {applications.map(app => (
            <li key={app.id}>
              <strong>{app.company}</strong> - {app.position} ({app.status})
              {app.deadline && <> — Deadline: {app.deadline}</>}
              {app.jobLink && (
                <>
                  {' '} — <a href={app.jobLink} target="_blank" rel="noreferrer">View</a>
                </>
              )}
              <button onClick={() => handleEdit(app)} style={{ marginLeft: '10px' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(app.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
