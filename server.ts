import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure data and upload directories exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
const dataFilePath = path.join(__dirname, 'src', 'data', 'projects.json');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage for project preview images
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanName = file.originalname
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Helper to read projects from code file
function readProjectsFromFile(): any[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading projects.json:', err);
  }
  return [];
}

// Helper to write projects directly to code file (automatic code update)
function writeProjectsToFile(projects: any[]): boolean {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing projects.json:', err);
    return false;
  }
}

// Admin authentication configuration
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BsAi0035%';

function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const provided = req.headers['x-admin-password'];
  if (provided !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Access denied.' });
  }
  next();
}

const profileFilePath = path.join(__dirname, 'src', 'data', 'profile.json');

function readProfileFromFile(): any {
  try {
    if (fs.existsSync(profileFilePath)) {
      return JSON.parse(fs.readFileSync(profileFilePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading profile.json:', err);
  }
  return {};
}

function writeProfileToFile(profile: any): boolean {
  try {
    const dir = path.dirname(profileFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(profileFilePath, JSON.stringify(profile, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing profile.json:', err);
    return false;
  }
}

// --- API Endpoints ---

// Profile endpoints
app.get('/api/profile', (_req, res) => {
  const profile = readProfileFromFile();
  res.json({ success: true, profile });
});

app.post('/api/profile/photo', requireAdminAuth, (req, res) => {
  try {
    const { profileImage, profileImageZoom, profileImagePosition } = req.body;
    const current = readProfileFromFile();

    const updated = {
      ...current,
      profileImage: profileImage || current.profileImage || '2.png',
      profileImageZoom: typeof profileImageZoom === 'number' ? profileImageZoom : current.profileImageZoom || 1,
      profileImagePosition: profileImagePosition || current.profileImagePosition || 'center 10%',
    };

    writeProfileToFile(updated);
    res.json({
      success: true,
      message: 'Profile photo updated and saved to code!',
      profile: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify Admin Password
app.post('/api/admin/verify', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Authenticated successfully' });
  }
  return res.status(401).json({ success: false, message: 'Incorrect password' });
});

// 1. Get all projects
app.get('/api/projects', (_req, res) => {
  const projects = readProjectsFromFile();
  res.json({ success: true, projects });
});

// 2. Add new project (updates codebase directly)
app.post('/api/projects', requireAdminAuth, (req, res) => {
  try {
    const newProject = req.body;
    if (!newProject.title) {
      return res.status(400).json({ success: false, message: 'Project title is required' });
    }

    const projects = readProjectsFromFile();
    const id = newProject.id || newProject.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    
    const formattedProject = {
      id,
      title: newProject.title,
      category: newProject.category || 'Web Application',
      description: newProject.description || '',
      icon: newProject.icon || '🚀',
      themeClass: newProject.themeClass || 'p1',
      link: newProject.link || '#',
      previewImage: newProject.previewImage || '',
      imageUrl: newProject.imageUrl || newProject.previewImage || '',
      imageZoom: typeof newProject.imageZoom === 'number' ? newProject.imageZoom : 1,
      imagePosition: newProject.imagePosition || 'center center',
      imageFit: newProject.imageFit || 'cover',
      createdAt: new Date().toISOString(),
      caseStudy: {
        overview: newProject.caseStudy?.overview || newProject.description || '',
        highlights: Array.isArray(newProject.caseStudy?.highlights)
          ? newProject.caseStudy.highlights
          : (newProject.highlights ? newProject.highlights.split('\n').filter(Boolean) : []),
        techStack: Array.isArray(newProject.caseStudy?.techStack)
          ? newProject.caseStudy.techStack
          : (newProject.techStack ? newProject.techStack.split(',').map((t: string) => t.trim()).filter(Boolean) : ['React']),
        liveUrl: newProject.link || '#',
        githubUrl: newProject.caseStudy?.githubUrl || newProject.githubUrl || 'https://github.com/nabeelvision',
      },
    };

    // Prepend new project so it appears first in featured list
    const updated = [formattedProject, ...projects];
    writeProjectsToFile(updated);

    res.json({
      success: true,
      message: 'Project successfully created and code updated!',
      project: formattedProject,
      totalProjects: updated.length,
    });
  } catch (err: any) {
    console.error('Failed to create project:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// 3. Update existing project
app.put('/api/projects/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const projects = readProjectsFromFile();
    const index = projects.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return res.status(400).json({ success: false, message: 'Project not found' });
    }

    projects[index] = {
      ...projects[index],
      ...updateData,
      id, // Preserve id
    };

    writeProjectsToFile(projects);
    res.json({
      success: true,
      message: 'Project updated successfully!',
      project: projects[index],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Delete project
app.delete('/api/projects/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const projects = readProjectsFromFile();
    const filtered = projects.filter((p: any) => p.id !== id);

    if (filtered.length === projects.length) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    writeProjectsToFile(filtered);
    res.json({ success: true, message: 'Project deleted successfully!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Image upload endpoint
app.post('/api/upload', requireAdminAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const relativeUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl: relativeUrl,
      fileName: req.file.filename,
      size: req.file.size,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// Dev or Production Vite mounting
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
