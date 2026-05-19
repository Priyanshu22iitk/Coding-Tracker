import { useState, useEffect } from 'react';
import axios from 'axios';

// 🌍 DYNAMIC API ROUTING: Uses live Render URL in production, defaults to localhost for development
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function App() {
  const [problems, setProblems] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    problem_url: '',
    platform: '',
    difficulty: 'Easy',
    solution_notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = () => {
    axios.get(`${API_BASE}/api/problems/`)
      .then(response => setProblems(response.data))
      .catch(error => console.error("Error fetching data:", error));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.platform) {
      alert("Please fill in the Title and Platform fields!");
      return;
    }

    axios.post(`${API_BASE}/api/problems/`, formData)
      .then(response => {
        setProblems([response.data, ...problems]);
        setFormData({ title: '', problem_url: '', platform: '', difficulty: 'Easy', solution_notes: '' });
      })
      .catch(error => console.error("Error posting data:", error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this problem log?")) {
      axios.delete(`${API_BASE}/api/problems/${id}/`)
        .then(() => {
          setProblems(problems.filter(problem => problem.id !== id));
        })
        .catch(error => console.error("Error deleting data:", error));
    }
  };    

  const totalSolved = problems.length;
  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          problem.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif', maxWidth: '700px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ textAlign: 'center', marginBlock: '10px' }}>Coding Problem Tracker</h1>
      <hr style={{ border: '0', height: '1px', background: '#444', marginBottom: '25px' }} />
      
      {/* ANALYTICS COUNTER BANNER */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', border: '1px solid #3c3c3c' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{totalSolved}</div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>Total Solved</div>
        </div>
        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', border: '1px solid #3c3c3c' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{easyCount}</div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>Easy</div>
        </div>
        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', border: '1px solid #3c3c3c' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>{mediumCount}</div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>Medium</div>
        </div>
        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', border: '1px solid #3c3c3c' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>{hardCount}</div>
          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>Hard</div>
        </div>
      </div>

      {/* THE LOGGING FORM */}
      <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px', marginBottom: '40px', border: '1px solid #333' }}>
        <h3 style={{ marginTop: 0, color: '#007bff' }}>Log a New Problem</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Problem Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Two Sum" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#2d2d2d', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Platform *</label>
              <input type="text" name="platform" value={formData.platform} onChange={handleChange} placeholder="e.g., LeetCode" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#2d2d2d', color: '#fff', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Problem URL</label>
              <input type="url" name="problem_url" value={formData.problem_url} onChange={handleChange} placeholder="https://leetcode.com/..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#2d2d2d', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#2d2d2d', color: '#fff', boxSizing: 'border-box' }}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Solution Notes / Key Concepts</label>
            <textarea name="solution_notes" value={formData.solution_notes} onChange={handleChange} placeholder="Write down your approach..." rows="3" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#2d2d2d', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Add Problem to Logs
          </button>
        </form>
      </div>

      {/* SEARCH AND FILTER CONTROLS */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search by title or platform..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#1e1e1e', color: '#fff' }}
        />
        <select 
          value={selectedDifficulty} 
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#1e1e1e', color: '#fff' }}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <h2>Logged Problems</h2>
      {filteredProblems.length === 0 ? (
        <p style={{ color: '#aaa' }}>No matching problems found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredProblems.map(problem => (
            <li key={problem.id} style={{ 
              background: '#1e1e1e', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '15px',
              borderLeft: `5px solid ${problem.difficulty === 'Easy' ? '#28a745' : problem.difficulty === 'Medium' ? '#ffc107' : '#dc3545'}`,
              borderTop: '1px solid #333', borderRight: '1px solid #333', borderBottom: '1px solid #333',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '20px', color: '#fff' }}>{problem.title}</strong> 
                <div>
                  <span style={{ color: '#aaa', fontSize: '14px', fontStyle: 'italic', marginRight: '15px' }}>{problem.platform}</span>
                  <button onClick={() => handleDelete(problem.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '16px' }}>
                    🗑️
                  </button>
                </div>
              </div>
              
              {problem.solution_notes && (
                <p style={{ color: '#ccc', margin: '10px 0 0 0', background: '#252525', padding: '10px', borderRadius: '4px', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                  {problem.solution_notes}
                </p>
              )}

              <div style={{ marginTop: '12px', fontSize: '14px' }}>
                {problem.problem_url && (
                  <a href={problem.problem_url} target="_blank" rel="noreferrer" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
                    View Problem Statement 🔗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;