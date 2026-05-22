import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { Camera, MapPin, Send, Loader2, CheckCircle2, LogOut, ShieldCheck, Leaf, Heart, BarChart3, Clock, Map as MapIcon, CheckCircle, AlertCircle, Eye, EyeOff, Mail, Lock, User as UserIcon, Trash2, Menu, X, Sun, Moon, Bell, Award, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import './index.css';
import GrievanceFeedSection from './components/GrievanceFeedSection';

// Fix for default marker icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Components ---

function Header({ user, onLogout, theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);

  // Read reports count & recent reports for dynamic notification items!
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const reportsCount = reports.length;
  const recentReports = reports.slice(0, 3);

  // Close other dropdowns if one is clicked
  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const handleToggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  return (
    <>
      <div className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="mobile-show" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} color="var(--text-header)" /> : <Menu size={24} color="var(--text-header)" />}
          </button>
          <div 
            onClick={() => setShowMissionModal(true)}
            style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-header)', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
            title="Click to view Eco Mission & Tips"
            className="logo-clickable"
          >
            <Leaf color="#04aa6d" weight="fill" size={32} /> <span className="mobile-hide">Clean-Green</span>
          </div>
        </div>
        
        <div className="search-bar mobile-hide">
          <input type="text" placeholder="Search site data..." />
          <MapPin size={18} style={{ position: 'absolute', right: '12px', top: '10px', opacity: 0.3 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button 
            onClick={toggleTheme}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', color: 'var(--text-header)' }}
            title={theme === 'dark' ? "Switch to Sunlight Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user && (
            <>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={handleToggleNotifications}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', color: 'var(--text-header)' }}
                  title="View Notifications"
                >
                  <Bell size={20} />
                  {reportsCount > 0 && <span className="notification-badge">{reportsCount}</span>}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="header-dropdown notification-dropdown"
                    >
                      <div className="dropdown-header">
                        <h4>Grievance Updates</h4>
                      </div>
                      <div className="dropdown-body">
                        {recentReports.length > 0 ? (
                          recentReports.map((report) => (
                            <div key={report.id} className="dropdown-item">
                              <span className="dot"></span>
                              <div>
                                <p className="item-title">Petition filed successfully: #{report.id.slice(-4)}</p>
                                <p className="item-desc">{report.category} • Lat: {report.latitude.toFixed(2)}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="no-data">No new notifications. Report a grievance to get started!</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile / Avatar Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={handleToggleProfile}
                  className="profile-btn"
                  title="Click to view Achievements"
                >
                  <div className="avatar-circle">
                    {user[0].toUpperCase()}
                  </div>
                  <span className="mobile-hide" style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user}</span>
                </button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="header-dropdown profile-dropdown"
                    >
                      <div className="profile-card-header">
                        <div className="avatar-large">{user[0].toUpperCase()}</div>
                        <h3>{user}</h3>
                        <p>Eco Citizen Reporter</p>
                      </div>
                      <div className="profile-card-stats">
                        <div className="p-stat">
                          <Award size={18} color="#04aa6d" />
                          <div style={{ textAlign: 'left' }}>
                            <h4>Rank</h4>
                            <p>{reportsCount >= 5 ? 'Eco Warrior' : reportsCount >= 2 ? 'Green Citizen' : 'Apprentice'}</p>
                          </div>
                        </div>
                        <div className="p-stat">
                          <Leaf size={18} color="#04aa6d" />
                          <div style={{ textAlign: 'left' }}>
                            <h4>Petitions</h4>
                            <p>{reportsCount} Filed</p>
                          </div>
                        </div>
                      </div>
                      <div className="profile-card-footer">
                        <button onClick={onLogout} className="logout-btn">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {!user && (
            <Link to="/login" style={{ background: '#04aa6d', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '25px', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}>Sign In</Link>
          )}
        </div>
      </div>

      {user && (
        <div className={`sub-header ${isMenuOpen ? 'open' : ''}`} style={{ gap: '2.5rem' }}>
           <a href="#status" onClick={() => setIsMenuOpen(false)}>STATUS</a>
           <a href="#maps" onClick={() => setIsMenuOpen(false)}>MAPS</a>
           <a href="#location" onClick={() => setIsMenuOpen(false)}>LOCATION</a>
           <a href="#grievance-feed" onClick={() => setIsMenuOpen(false)}>AWARENESS</a>
           <a href="#grievance-feed" onClick={() => setIsMenuOpen(false)}>REPORTS</a>
        </div>
      )}

      {/* Info / Mission Modal */}
      <AnimatePresence>
        {showMissionModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="eco-modal-overlay"
            onClick={() => setShowMissionModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="eco-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>🍃 Clean-Green Mission</h2>
                <button className="close-btn" onClick={() => setShowMissionModal(false)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <p>Welcome to <strong>Clean-Green</strong>, a state-of-the-art citizen platform designed to resolve ecological hazards. By empowering citizens to easily report and document waste accumulation, we build clean, healthy, and toxic-free communities.</p>
                
                <h3 style={{ textAlign: 'left' }}>🌟 Core Eco-Citizen Tips:</h3>
                <ul style={{ textAlign: 'left' }}>
                  <li><strong>Pin Accuracy:</strong> Drop the marker exactly on the affected site so sanitation crews can navigate accurately.</li>
                  <li><strong>Good Evidence:</strong> Always take a clear, high-quality photograph of the debris. Better visual evidence leads to faster Department resolution.</li>
                  <li><strong>Department Selection:</strong> Be sure to categorize correctly (e.g. Plastic, Clinical, Electronic) so our server formats and routes the petition to the correct commissioner.</li>
                  <li><strong>Dispatch Power:</strong> Remember to click the **Dispatch** button under the grievance feed to send an email!</li>
                </ul>

                <button className="btn-primary" onClick={() => setShowMissionModal(false)} style={{ marginTop: '1.5rem' }}>GOT IT, ECO CITIZEN!</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="mobile-show"
          style={{ position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
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

      <div className="footer-links-row" style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontWeight: 800, color: '#313131', fontSize: '1.1rem' }}>
         <span style={{ cursor: 'pointer' }}>🌐 FORUM</span> 
         <a href="#grievance-feed" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>📖 ABOUT</a> 
         <span style={{ cursor: 'pointer' }}>🎓 ACADEMY</span>
      </div>

      <div className="footer-social-row" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem', color: '#444', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
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
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchHistory();
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err)
    );
  }, []);

  const fetchHistory = () => {
    try {
      const reports = JSON.parse(localStorage.getItem('reports') || '[]');
      setHistory(reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
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
        `PHOTO LINK: (Attached in email/local storage)\n\n` +
        `SINCERELY,\nCITIZEN REPORTER`
    );
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${target}&su=${subject}&body=${body}`, '_blank');
  };

  const handleSubmit = async () => {
    if (!position || !image) return alert("Missing Evidence.");
    setIsSubmitting(true);

    try {
      const newReport = {
        id: `PET-${Date.now().toString().slice(-6)}`,
        latitude: position[0],
        longitude: position[1],
        category,
        problem,
        imagePath: image, // Store Base64 string directly
        timestamp: new Date().toISOString()
      };
      
      const reports = JSON.parse(localStorage.getItem('reports') || '[]');
      reports.push(newReport);
      localStorage.setItem('reports', JSON.stringify(reports));

      setStatus('success');
      setProblem('');
      fetchHistory();
      
      // AUTO GMAIL REDIRECT
      setTimeout(() => {
        handleGmailDispatch(newReport);
        setStatus(null); setImage(null); setFile(null);
      }, 1500);

    } catch (err) { 
      setStatus('error'); 
      setTimeout(() => setStatus(null), 3000);
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      let reports = JSON.parse(localStorage.getItem('reports') || '[]');
      reports = reports.filter(r => r.id !== id);
      localStorage.setItem('reports', JSON.stringify(reports));
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };



  return (
    <div className="container" style={{ scrollBehavior: 'smooth' }}>
      <div className="stats-grid" id="status" style={{ scrollMarginTop: '120px' }}>
        {[
          { val: history.length, label: 'Total Flagged' },
          { val: history.filter((_, i) => i % 3 === 0).length + 2, label: 'Solved Alerts' },
          { val: '4.9/5', label: 'Eco Score' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(4, 170, 109, 0.15)' }}
          >
            <h3>{s.val}</h3>
            <p>{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="main-flex">
        <div className="card" id="maps" style={{ scrollMarginTop: '120px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>📍 1. Mark Site Location</h2>
          <div className="map-container">
             <MapContainer center={position || [20, 78]} zoom={5}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapUpdater center={position} />
                <LocationMarker position={position} setPosition={setPosition} />
             </MapContainer>
          </div>
        </div>

        <div className="card" id="location" style={{ scrollMarginTop: '120px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>📷 2. Upload Photo</h2>
          <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageChange} />
          
          <div style={{ marginBottom: '1.5rem' }}>
             <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#666' }}>Select Waste Department:</label>
             <select 
               value={category} 
               onChange={(e) => setCategory(e.target.value)}
               style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '0.9rem', cursor: 'pointer' }}
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
               style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '0.9rem', minHeight: '80px', fontFamily: 'inherit' }}
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

      <GrievanceFeedSection
        history={history}
        deletingId={deletingId}
        onDispatch={handleGmailDispatch}
        onDelete={handleDelete}
      />
    </div>
  );
}

function AuthPage({ type }) {
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (type === 'register') {
        if (users.find(u => u.email === form.email)) {
          throw new Error("Email already exists");
        }
        users.push({ ...form, id: Date.now() });
        localStorage.setItem('users', JSON.stringify(users));
        navigate('/login');
      } else {
        const user = users.find(u => u.email === form.email && u.password === form.password);
        if (!user) throw new Error("Invalid Credentials");
        
        localStorage.setItem('token', 'dummy-token-123');
        localStorage.setItem('username', user.username);
        window.location.href = '/';
      }
    } catch (err) { 
      setError(err.message || "An error occurred."); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="modern-auth-card"
      >
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(4, 170, 109, 0.1)', borderRadius: '20px', marginBottom: '1.5rem' }}>
            <Leaf color="#04aa6d" size={40} />
          </div>
          <h2>{type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{type === 'login' ? 'Sign in to your Clean-Green account' : 'Join our green community today'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="error-message"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {type === 'register' && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-wrapper">
                <UserIcon className="input-icon" size={18} />
                <input 
                  type="text"
                  placeholder="Enter your name" 
                  className="modern-input"
                  required
                  onChange={e => setForm({...form, username: e.target.value})} 
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="modern-input"
                required
                onChange={e => setForm({...form, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '2.5rem' }}>
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="modern-input"
                required
                onChange={e => setForm({...form, password: e.target.value})} 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={isLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1.1rem' }}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (type === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')}
          </button>

          <div className="auth-footer">
            {type === 'login' ? (
              <p>Don't have an account? <Link to="/register">Sign up for free</Link></p>
            ) : (
              <p>Already have an account? <Link to="/login">Sign in here</Link></p>
            )}
          </div>
        </form>
      </motion.div>
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
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <BrowserRouter>
      <div className="App">
        <Header 
          user={user} 
          onLogout={() => { localStorage.clear(); window.location.href='/login'; }} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
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
