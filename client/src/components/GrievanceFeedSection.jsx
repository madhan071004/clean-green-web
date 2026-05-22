import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Play,
  Landmark,
  Recycle,
  Droplets,
  Zap,
  Shield,
  ExternalLink,
} from 'lucide-react';
import dustImg from '../../../imgs/dust.jpg';
import natureImg from '../../../imgs/nature.jpg';
import pollutionImg from '../../../imgs/pollution.jpg';
import worldImg from '../../../imgs/world.jpg';

const AWARENESS_IMAGES = [
  {
    title: 'Protect Our Planet',
    caption: 'Every citizen action counts toward a cleaner, greener India and a healthier world.',
    src: worldImg,
    tag: 'Global',
  },
  {
    title: 'Preserve Nature & Green Spaces',
    caption: 'Safeguard forests, parks, and biodiversity — report encroachment and illegal dumping near natural areas.',
    src: natureImg,
    tag: 'Nature',
  },
  {
    title: 'Fight Air & Dust Pollution',
    caption: 'Document construction dust, open burning, and poor air quality so authorities can enforce CPCB norms.',
    src: dustImg,
    tag: 'Air Quality',
  },
  {
    title: 'Stop Urban Pollution',
    caption: 'Photo evidence of waste piles, plastic litter, and toxic hotspots speeds municipal cleanup under MSW Rules.',
    src: pollutionImg,
    tag: 'Grievance',
  },
];

const AWARENESS_VIDEOS = [
  {
    title: 'Swachh Bharat Mission - Urban 2.0 — Humein Garv Hai',
    channel: 'Swachh Bharat Urban',
    embedId: '6sBOe4gZds4',
    description: 'Urban cleanliness mission highlights — citizen pride and municipal action across Indian cities.',
  },
  {
    title: 'TrashBack — Environmental Awareness',
    channel: 'Camarus Production',
    embedId: 'OjpQkqHOKXc',
    description: 'Short film on waste, responsibility, and why documenting dumping sites matters for your community.',
  },
  {
    title: 'A Short Film on Plastic — #BeatPlasticPollution',
    channel: 'Gautam Dey',
    embedId: '2FSSj5CiSxs',
    description: 'Plastic waste impact on the environment — align grievance reports with state plastic policies.',
  },
  {
    title: 'Swachh Bharat Mission: A Global Recognition of India’s Cleanliness Drive',
    channel: 'DD India',
    embedId: 'DPTq1pSr1KM',
    description: 'How India’s national cleanliness mission gained global recognition — context for citizen reporting.',
  },
];

const ABOUT_STATS = [
  { icon: Landmark, label: 'ULB Routing', value: 'Municipal' },
  { icon: Recycle, label: 'Waste Types', value: '4 Depts' },
  { icon: Droplets, label: 'Water Bodies', value: 'Protected' },
  { icon: Zap, label: 'E-Waste', value: 'Tracked' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function AwarenessCarousel() {
  const [index, setIndex] = useState(0);
  const current = AWARENESS_IMAGES[index];

  const prev = () => setIndex((i) => (i === 0 ? AWARENESS_IMAGES.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === AWARENESS_IMAGES.length - 1 ? 0 : i + 1));

  return (
    <div className="awareness-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="carousel-slide"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
        >
          <img src={current.src} alt={current.title} loading="lazy" />
          <div className="carousel-overlay">
            <span className="carousel-tag">{current.tag}</span>
            <h4>{current.title}</h4>
            <p>{current.caption}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <button type="button" className="carousel-nav prev" onClick={prev} aria-label="Previous">
        <ChevronLeft size={22} />
      </button>
      <button type="button" className="carousel-nav next" onClick={next} aria-label="Next">
        <ChevronRight size={22} />
      </button>
      <div className="carousel-dots">
        {AWARENESS_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === index ? 'active' : ''}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function GrievanceFeedSection({
  history,
  deletingId,
  onDispatch,
  onDelete,
}) {
  const [activeVideo, setActiveVideo] = useState(AWARENESS_VIDEOS[0].embedId);

  return (
    <section id="grievance-feed" className="grievance-feed-section" style={{ scrollMarginTop: '120px' }}>
      <motion.div
        className="grievance-feed-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={fadeUp}
      >
        <div className="feed-header-badge">
          <span className="india-tricolor" aria-hidden />
          OFFICIAL GRIEVANCE FEED · INDIA
        </div>
        <h2>Clean-Green Civic Awareness & Petitions</h2>
        <p>
          Report environmental hazards to municipal commissioners under India&apos;s waste rules.
          Learn below, then file geo-tagged petitions in your feed.
        </p>
      </motion.div>

      {/* About */}
      <motion.div
        className="about-clean-green"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="about-content">
          <motion.div className="about-glow" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 6, repeat: Infinity }} />
          <h3>
            <Shield size={22} color="var(--primary)" /> About Clean-Green
          </h3>
          <p>
            <strong>Clean-Green</strong> is a citizen grievance platform aligned with Indian municipal
            solid waste management. Pin exact locations, attach photo evidence, categorize waste
            (municipal, biomedical, e-waste, plastic), and dispatch official petitions to department
            heads — the same workflow used by Swachh Bharat and local ULB complaint cells.
          </p>
          <ul className="about-list">
            <li>Geo-tagged reports for ward-level sanitation crews</li>
            <li>Routes aligned with MSW Rules 2016 &amp; plastic waste management</li>
            <li>One-click Gmail dispatch to commissioners / HODs</li>
            <li>Transparent status tracking in your personal grievance feed</li>
          </ul>
          <a
            href="https://swachhbharatmission.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            Swachh Bharat Mission <ExternalLink size={14} />
          </a>
        </div>
        <div className="about-stats-row">
          {ABOUT_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="about-stat-pill"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <s.icon size={22} color="var(--primary)" />
              <span className="pill-value">{s.value}</span>
              <span className="pill-label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Awareness images */}
      <motion.div
        className="awareness-block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h3 className="subsection-title">🇮🇳 Environmental Awareness — India</h3>
        <p className="subsection-desc">
          Visual guides for common grievance types filed through Clean-Green. Use these references
          when documenting sites in your city or town.
        </p>
        <div className="awareness-layout">
          <AwarenessCarousel />
          <div className="awareness-thumb-grid">
            {AWARENESS_IMAGES.map((img, i) => (
              <motion.div
                key={img.title}
                className="thumb-card"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
              >
                <img src={img.src} alt={img.title} loading="lazy" />
                <span>{img.tag}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Videos */}
      <motion.div
        className="video-awareness-block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h3 className="subsection-title">
          <Play size={20} /> Awareness Videos
        </h3>
        <p className="subsection-desc">
          India-focused campaigns on cleanliness, waste segregation, and pollution control.
        </p>
        <div className="video-layout">
          <div className="video-player-wrap">
            <iframe
              title="Environmental awareness video"
              src={`https://www.youtube.com/embed/${activeVideo}?rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="video-playlist">
            {AWARENESS_VIDEOS.map((v) => (
              <button
                key={v.embedId}
                type="button"
                className={`video-item ${activeVideo === v.embedId ? 'active' : ''}`}
                onClick={() => setActiveVideo(v.embedId)}
              >
                <div className="video-item-thumb">
                  <img
                    src={`https://img.youtube.com/vi/${v.embedId}/mqdefault.jpg`}
                    alt=""
                  />
                  <Play size={18} className="play-icon" />
                </div>
                <div>
                  <strong>{v.title}</strong>
                  <span>{v.channel}</span>
                  <p>{v.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* User petitions */}
      <motion.div
        className="user-petitions-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h3>Your Filed Petitions</h3>
        <p>{history.length === 0 ? 'No grievances yet — submit your first report above.' : `${history.length} active report(s)`}</p>
      </motion.div>

      <motion.div
        className="feed-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        {history.length === 0 ? (
          <div className="feed-empty">
            <Recycle size={48} strokeWidth={1.2} color="var(--primary)" />
            <p>Your official grievance cards will appear here after you submit a petition.</p>
          </div>
        ) : (
          history.map((h, i) => (
            <motion.div
              key={h.id || i}
              className="feed-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
            >
              {h.imagePath && <img src={h.imagePath} className="feed-image" alt="Site view" />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="status-badge">{i % 2 === 0 ? 'CLEANED' : 'AWAITING REPAIR'}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {h.category || 'General'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.6 }}>#{h.id.slice(-4)}</span>
              </div>
              <div className="feed-problem">{h.problem}</div>
              <div className="feed-meta">
                Lat: {h.latitude.toFixed(4)}, Lng: {h.longitude.toFixed(4)}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => onDispatch(h)}
                  className="dispatch-btn"
                >
                  🚀 DISPATCH
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(h.id)}
                  disabled={deletingId === h.id}
                  className="delete-btn"
                  title="Delete Report"
                >
                  {deletingId === h.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
}
