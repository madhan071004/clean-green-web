import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { Camera, MapPin, Send, Loader2, CheckCircle2, LogOut, ShieldCheck, Leaf, Heart, BarChart3, Clock, Map as MapIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import './index.css';

// Fix for default marker icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Components ---

function Header({ user, onLogout }) {
  return (
    <>
      <div className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#313131', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
            <Leaf color="#04aa6d" weight="fill" size={32} /> Clean-Green
          </Link>
        </div>
        
        <div className="search-bar mobile-hide">
          <input type="text" placeholder="Search site data..." />
          <MapPin size={18} style={{ position: 'absolute', right: '12px', top: '10px', opacity: 0.3 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
               <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user}</span>
               <button onClick={onLogout} style={{ background: '#313131', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={{ background: '#04aa6d', color: 'white', padding: '0.65rem 1.8rem', borderRadius: '25px', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          )}
        </div>
      </div>

      <div className="sub-header">
         <Link to="#">STATUS</Link>
         <Link to="#">MAPS</Link>
         <Link to="#">LOCATION</Link>
         <Link to="#">REPORTS</Link>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="rich-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>Top Status</h4>
          <ul><li>Verified Reports</li><li>Cleaning In-Progress</li><li>Solved Alerts</li><li>Pending Review</li></ul>
        </div>
        <div className="footer-col">
          <h4>References</h4>
          <ul><li>Leaflet Map API</li><li>Node Mailer</li><li>Vite React Bundle</li><li>Express Routes</li></ul>
        </div>
        <div className="footer-col">
          <h4>Top Tasks</h4>
          <ul><li>Report Waste</li><li>Track Progress</li><li>Authority Login</li><li>Contact Council</li></ul>
        </div>
        <div className="footer-col">
          <h4>Get Certified</h4>
          <ul><li>Eco Certificate</li><li>Green Citizen</li><li>Verified Reporter</li><li>Municipality Partner</li></ul>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontWeight: 800, color: '#313131', fontSize: '1.1rem' }}>
         <span style={{ cursor: 'pointer' }}>🌐 FORUM</span> 
         <span style={{ cursor: 'pointer' }}>📖 ABOUT</span> 
         <span style={{ cursor: 'pointer' }}>🎓 ACADEMY</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem', color: '#444', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
         <span style={{ cursor: 'pointer' }}>facebook</span>
         <span style={{ cursor: 'pointer' }}>twitter</span>
         <span style={{ cursor: 'pointer' }}>linkedin</span>
         <span style={{ cursor: 'pointer' }}>instagram</span>
      </div>

      <div className="footer-bottom">
        <p>Clean-Green is optimized for reporting and environmental data management. Examples might be simplified to improve reading and learning. Tutorials, references, and examples are constantly reviewed to avoid errors, but we cannot warrant full correctness of all content. While using Clean-Green, you agree to have read and accepted our terms of use, cookies and privacy policy.</p>
        <p>Copyright 2026 by Madhan. All Rights Reserved. Clean-Green is Powered by Node.JS.</p>
      </div>
    </footer>
  );
}

// --- Dashboard ---

function Dashboard() {
  const [position, setPosition] = useState(null);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('Municipal (General)');
  const [problem, setProblem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchHistory();
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err)
    );
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('https://clean-green-qoun.onrender.com/api/reports');
      setHistory(res.data);
    } catch (err) { console.error(err); }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target.result);
        reader.readAsDataURL(selectedFile);
    }
  };

  const handleGmailDispatch = (report) => {
    const target = "720822103095@hit.edu.in";
    const subject = encodeURIComponent(`🏛️ OFFICIAL PETITION [${report.id}]: ${report.category}`);
    const body = encodeURIComponent(
        `TO: THE COMMISSIONER / HEAD OF DEPARTMENT\n` +
        `PETITION ID: ${report.id}\n\n` +
        `GRIEVANCE DETAILS:\n${report.problem}\n\n` +
        `LOCATION: ${report.latitude}, ${report.longitude}\n` +
        `PHOTO LINK: https://clean-green-qoun.onrender.com/${report.imagePath?.replace(/\\/g, '/')}\n\n` +
        `SINCERELY,\nCITIZEN REPORTER`
    );
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${target}&su=${subject}&body=${body}`, '_blank');
  };

  const handleSubmit = async () => {
    if (!position || !file) return alert("Missing Evidence.");
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('latitude', position[0]);
    formData.append('longitude', position[1]);
    formData.append('category', category);
    formData.append('problem', problem);
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://clean-green-qoun.onrender.com/api/reports', formData, {
        headers: { 'x-auth-token': token }
      });
      setStatus('success');
      setProblem('');
      fetchHistory();
      
      // AUTO GMAIL REDIRECT
      setTimeout(() => {
        handleGmailDispatch({
            id: `PET-${Date.now().toString().slice(-6)}`,
            category,
            problem,
            latitude: position[0],
            longitude: position[1]
        });
        setStatus(null); setImage(null); setFile(null);
      }, 1500);

    } catch (err) { setStatus('error'); setTimeout(() => setStatus(null), 3000);
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="container">
      <div className="stats-grid">
        <div className="stat-card"><h3>{history.length}</h3><p>Total Flagged</p></div>
        <div className="stat-card"><h3>{history.filter((_, i) => i % 3 === 0).length + 2}</h3><p>Solved Alerts</p></div>
        <div className="stat-card"><h3>4.9/5</h3><p>Eco Score</p></div>
      </div>

      <div className="main-flex">
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>📍 1. Mark Site Location</h2>
          <div className="map-container">
             <MapContainer center={position || [20, 78]} zoom={5}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapUpdater center={position} />
                <LocationMarker position={position} setPosition={setPosition} />
             </MapContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>📷 2. Upload Photo</h2>
          <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageChange} />
          
          <div style={{ marginBottom: '1.5rem' }}>
             <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#666' }}>Select Waste Department:</label>
             <select 
               value={category} 
               onChange={(e) => setCategory(e.target.value)}
               style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}
             >
                <option>Municipal (General)</option>
                <option>Bio-medical (Clinics)</option>
                <option>Electronic (E-waste)</option>
                <option>Plastic & Toxic</option>
             </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
             <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#666' }}>What is the problem? (Describe it):</label>
             <textarea 
               value={problem} 
               onChange={(e) => setProblem(e.target.value)}
               placeholder="e.g. Large pile of plastic bottles blocking the road..."
               style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', fontSize: '0.9rem', minHeight: '80px', fontFamily: 'inherit' }}
             />
          </div>

          <div className="upload-box" onClick={() => fileInputRef.current.click()}>
             {image ? <img src={image} style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '8px' }} /> : (
               <div style={{ textAlign: 'center', opacity: 0.3 }}>
                 <Camera size={48} />
                 <p>Drop site photo here</p>
               </div>
             )}
          </div>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'FILING PETITION...' : status === 'success' ? 'PETITION FILED ✅' : 'SUBMIT OFFICIAL PETITION'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '2rem', fontWeight: 900, borderLeft: '8px solid #04aa6d', paddingLeft: '1rem' }}>OFFICIAL GRIEVANCE FEED</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {history.map((h, i) => (
            <div key={h.id || i} style={{ background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #eee' }}>
               {h.imagePath && <img src={`https://clean-green-qoun.onrender.com/${h.imagePath.replace(/\\/g, '/')}`} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} alt="Site view" />}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#eefef4', color: '#04aa6d', borderRadius: '20px' }}>
                    {i % 2 === 0 ? 'CLEANED' : 'AWAITING REPAIR'}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.6, textTransform: 'uppercase' }}>{h.category || 'General'}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>#{h.id.slice(-4)}</span>
               </div>
               <div style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>{h.problem}</div>
               <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>Lat: {h.latitude.toFixed(4)}, Lng: {h.longitude.toFixed(4)}</div>
               
               <button 
                  onClick={() => handleGmailDispatch(h)}
                  style={{ marginTop: '1.5rem', width: '100%', background: '#ffeded', color: '#db4437', border: '1px solid #ffcccc', padding: '0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  🚀 OFFICIAL GMAIL DISPATCH
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthPage({ type }) {
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`https://clean-green-qoun.onrender.com${url}`, form);
      if (type === 'login') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        window.location.href = '/';
      } else { navigate('/login'); }
    } catch (err) { setError(err.response?.data?.error || "Invalid Credentials"); }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{type === 'login' ? 'Login Portal' : 'Register Account'}</h2>
        <form onSubmit={handleSubmit}>
          {type === 'register' && <input placeholder="Your Name" onChange={e => setForm({...form, username: e.target.value})} />}
          <input type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
          <button className="btn-primary" type="submit">{type === 'login' ? 'LOGIN' : 'SIGN UP'}</button>
          {error && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            {type === 'login' ? <Link to="/register">Create new account</Link> : <Link to="/login">Back to Sign In</Link>}
          </div>
        </form>
      </div>
    </div>
  );
}

function MapUpdater({ center }) {
  const map = useMap(); useEffect(() => { if (center) map.setView(center, 15); }, [center]); return null;
}
function LocationMarker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition([e.latlng.lat, e.latlng.lng]); } });
  return position === null ? null : <Marker position={position} />;
}

function App() {
  const [user, setUser] = useState(localStorage.getItem('username'));
  return (
    <BrowserRouter>
      <div className="App">
        <Header user={user} onLogout={() => { localStorage.clear(); window.location.href='/login'; }} />
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <AuthPage type="login" /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <AuthPage type="register" /> : <Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
