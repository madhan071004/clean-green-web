const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// 📂 DATABASE MOCK (Zero-Config JSON Storage)
const DB_FILE = './database.json';
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], reports: [] }, null, 2));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const saveDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

console.log("✅ Zero-Config Database INITIALIZED (No MongoDB Needed)!");

// Basic Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📂 Ensure Uploads Directory exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, `report-${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- Auth Routes ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const db = getDB();
        
        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = { id: Date.now().toString(), email, password: hashed, username };
        
        db.users.push(newUser);
        saveDB(db);

        res.status(201).json({ message: "Registration Complete!" });
    } catch (err) {
        res.status(500).json({ error: "Register failed: " + err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDB();
        const user = db.users.find(u => u.email === email);
        
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Wrong password" });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: "Login failed: " + err.message });
    }
});

// Middleware: Auth Check
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ error: "Unauthorized access" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// --- Report Routes ---

app.post('/api/reports', auth, upload.single('image'), async (req, res) => {
    try {
        const { latitude, longitude, category, problem } = req.body;
        const imagePath = req.file ? req.file.path : null;

        const db = getDB();
        const petitionId = `PET-${Date.now().toString().slice(-6)}`;
        const newReport = {
            id: petitionId,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            category: category || "Municipal (General)",
            problem: problem || "No description provided.",
            imagePath,
            userId: req.userId,
            timestamp: new Date()
        };
        
        db.reports.push(newReport);
        saveDB(db);

        // 🍃 EMAIL DISPATCH DEACTIVATED PER USER REQUEST

        res.status(201).json({ message: "Success", report: newReport });
    } catch (err) {
        res.status(500).json({ error: "Server error during submission: " + err.message });
    }
});

app.post('/api/reports/:id/email', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        
        console.log(`📧 Request to dispatch email for Petition ID: ${id}`);
        const report = db.reports.find(r => String(r.id) === String(id));
        
        if (!report) {
            console.error(`❌ Petition NOT FOUND in database for ID: ${id}`);
            return res.status(404).json({ error: `Petition ${id} not found in database.` });
        }

        const user = db.users.find(u => u.id === report.userId);
        
        // 📧 Advanced Department Routing Mapping
        const DEPT_EMAILS = {
            "Municipal (General)": process.env.MUNICIPAL_EMAIL || process.env.RECIPIENT_EMAIL || "720822103123@hit.edu.in",
            "Bio-medical (Clinics)": process.env.BIOMEDICAL_EMAIL || process.env.RECIPIENT_EMAIL || "720822103123@hit.edu.in",
            "Electronic (E-waste)": process.env.ELECTRONIC_EMAIL || process.env.RECIPIENT_EMAIL || "720822103123@hit.edu.in",
            "Plastic & Toxic": process.env.PLASTIC_EMAIL || process.env.RECIPIENT_EMAIL || "720822103123@hit.edu.in"
        };

        const deptTarget = DEPT_EMAILS[report.category] || process.env.RECIPIENT_EMAIL;
        const recipientList = [deptTarget];
        
        // Explicitly send CC to reporter
        if (user?.email) recipientList.push(user.email);
        
        console.log(`🚀 Dispatching PETITION ${report.id} to ${deptTarget}...`);

        const htmlTemplate = `
            <div style="font-family: 'Times New Roman', serif; border: 2px solid #333; padding: 40px; max-width: 700px; color: #1a1a1a; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="margin: 0; color: #04aa6d; font-size: 24px;">OFFICIAL MUNICIPAL PETITION</h1>
                    <p style="margin: 5px 0; font-weight: bold; font-size: 14px;">Environmental Grievance Redressal Cell</p>
                    <hr style="border: 0; border-top: 1px solid #333;">
                </div>
                <div style="margin-bottom: 20px;">
                    <p><strong>Petition No:</strong> ${report.id}</p>
                    <p><strong>Dated:</strong> ${new Date(report.timestamp).toLocaleDateString()}</p>
                    <p><strong>Subject:</strong> Formal Grievance regarding waste accumulation in ${report.category} zone.</p>
                </div>
                <p><strong>To,</strong><br>The Commissioner/Head of Department,<br>${report.category} Department,<br>Municipal Corporation.</p>
                <div style="background: #f1f1f1; padding: 20px; border-left: 5px solid #04aa6d; margin: 20px 0;">
                    <p><strong>Nature of Complaint:</strong> ${report.problem}</p>
                    <p><strong>Geographical Site:</strong> ${report.latitude}, ${report.longitude}</p>
                </div>
                <p><strong>Sincerely,</strong></p>
                <p style="font-style: italic;">Verified Clean-Green Citizen</p>
            </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientList.join(','),
            subject: `🏛️ [MANUAL DISPATCH] PETITION ${report.id}`,
            html: htmlTemplate,
            attachments: report.imagePath ? [{ path: report.imagePath }] : []
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) return res.status(500).json({ error: "Email delivery failed: " + err.message });
            res.json({ message: "Petition dispatched successfully to department!" });
        });
    } catch (err) {
        res.status(500).json({ error: "Email error: " + err.message });
    }
});

app.get('/api/reports', async (req, res) => {
    try {
        const db = getDB();
        res.json(db.reports.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (err) {
        res.status(500).json({ error: "Could not fetch reports" });
    }
});

app.listen(PORT, () => console.log(`🚀 Zero-Config Backend ready on Port ${PORT}`));
